import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-hot-toast';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function FireDrillLogs() {
  const [drills, setDrills] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [newDrill, setNewDrill] = useState({
    date: '',
    location: '',
    participants: '',
    duration: '',
  });
  const [newIncident, setNewIncident] = useState({
    date: '',
    location: '',
    type: '',
    severity: '',
    description: '',
  });
  const [showDrillForm, setShowDrillForm] = useState(false);
  const [showIncidentForm, setShowIncidentForm] = useState(false);

  useEffect(() => {
    fetchDrills();
    fetchIncidents();
  }, []);

  const fetchDrills = async () => {
    try {
      const q = query(collection(db, 'fireDrills'));
      const querySnapshot = await getDocs(q);
      const drillsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDrills(drillsData);
    } catch (error) {
      toast.error('Error fetching fire drills');
    }
  };

  const fetchIncidents = async () => {
    try {
      const q = query(collection(db, 'fireIncidents'));
      const querySnapshot = await getDocs(q);
      const incidentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setIncidents(incidentsData);
    } catch (error) {
      toast.error('Error fetching fire incidents');
    }
  };

  const handleAddDrill = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'fireDrills'), {
        ...newDrill,
        timestamp: new Date(),
      });
      toast.success('Fire drill added successfully');
      setNewDrill({
        date: '',
        location: '',
        participants: '',
        duration: '',
      });
      setShowDrillForm(false);
      fetchDrills();
    } catch (error) {
      toast.error('Error adding fire drill');
    }
  };

  const handleAddIncident = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'fireIncidents'), {
        ...newIncident,
        timestamp: new Date(),
      });
      toast.success('Fire incident added successfully');
      setNewIncident({
        date: '',
        location: '',
        type: '',
        severity: '',
        description: '',
      });
      setShowIncidentForm(false);
      fetchIncidents();
    } catch (error) {
      toast.error('Error adding fire incident');
    }
  };

  const chartData = {
    labels: drills.map(drill => drill.date),
    datasets: [
      {
        label: 'Participants',
        data: drills.map(drill => drill.participants),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Fire Drill & Incident Logs</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowDrillForm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Add Fire Drill
          </button>
          <button
            onClick={() => setShowIncidentForm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Add Incident
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fire Drills</h3>
            <div className="mb-4">
              <Line data={chartData} />
            </div>
            <ul className="divide-y divide-gray-200">
              {drills.map((drill) => (
                <li key={drill.id} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-600">
                        {drill.location}
                      </p>
                      <p className="text-sm text-gray-500">Date: {drill.date}</p>
                      <p className="text-sm text-gray-500">Participants: {drill.participants}</p>
                      <p className="text-sm text-gray-500">Duration: {drill.duration} minutes</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fire Incidents</h3>
            <ul className="divide-y divide-gray-200">
              {incidents.map((incident) => (
                <li key={incident.id} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-600">
                        {incident.location}
                      </p>
                      <p className="text-sm text-gray-500">Date: {incident.date}</p>
                      <p className="text-sm text-gray-500">Type: {incident.type}</p>
                      <p className="text-sm text-gray-500">Severity: {incident.severity}</p>
                      <p className="text-sm text-gray-500">Description: {incident.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {showDrillForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Fire Drill</h3>
            <form onSubmit={handleAddDrill}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={newDrill.date}
                    onChange={(e) => setNewDrill({ ...newDrill, date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    value={newDrill.location}
                    onChange={(e) => setNewDrill({ ...newDrill, location: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Participants</label>
                  <input
                    type="number"
                    value={newDrill.participants}
                    onChange={(e) => setNewDrill({ ...newDrill, participants: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                  <input
                    type="number"
                    value={newDrill.duration}
                    onChange={(e) => setNewDrill({ ...newDrill, duration: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-5 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDrillForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Add Drill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showIncidentForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Fire Incident</h3>
            <form onSubmit={handleAddIncident}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={newIncident.date}
                    onChange={(e) => setNewIncident({ ...newIncident, date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    value={newIncident.location}
                    onChange={(e) => setNewIncident({ ...newIncident, location: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={newIncident.type}
                    onChange={(e) => setNewIncident({ ...newIncident, type: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="electrical">Electrical</option>
                    <option value="chemical">Chemical</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Severity</label>
                  <select
                    value={newIncident.severity}
                    onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Severity</option>
                    <option value="minor">Minor</option>
                    <option value="moderate">Moderate</option>
                    <option value="major">Major</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newIncident.description}
                    onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows="3"
                    required
                  />
                </div>
              </div>
              <div className="mt-5 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowIncidentForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Add Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FireDrillLogs; 