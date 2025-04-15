import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-hot-toast';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
    width: '100%',
    height: '400px',
};

const center = {
    lat: -24.6541,
    lng: 25.9087,
};

function SecurityPatrol() {
    const [patrols, setPatrols] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [newPatrol, setNewPatrol] = useState({
        date: '',
        location: '',
        officer: '',
        status: 'active',
    });
    const [newIncident, setNewIncident] = useState({
        date: '',
        location: '',
        type: '',
        severity: '',
        description: '',
    });
    const [showPatrolForm, setShowPatrolForm] = useState(false);
    const [showIncidentForm, setShowIncidentForm] = useState(false);

    useEffect(() => {
        fetchPatrols();
        fetchIncidents();
    }, []);

    const fetchPatrols = async () => {
        try {
            const q = query(collection(db, 'securityPatrols'));
            const querySnapshot = await getDocs(q);
            const patrolsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPatrols(patrolsData);
        } catch (error) {
            toast.error('Error fetching patrols');
        }
    };

    const fetchIncidents = async () => {
        try {
            const q = query(collection(db, 'securityIncidents'));
            const querySnapshot = await getDocs(q);
            const incidentsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setIncidents(incidentsData);
        } catch (error) {
            toast.error('Error fetching incidents');
        }
    };

    const handleAddPatrol = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'securityPatrols'), {
                ...newPatrol,
                timestamp: new Date(),
            });
            toast.success('Patrol added successfully');
            setNewPatrol({
                date: '',
                location: '',
                officer: '',
                status: 'active',
            });
            setShowPatrolForm(false);
            fetchPatrols();
        } catch (error) {
            toast.error('Error adding patrol');
        }
    };

    const handleAddIncident = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'securityIncidents'), {
                ...newIncident,
                timestamp: new Date(),
            });
            toast.success('Incident added successfully');
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
            toast.error('Error adding incident');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Security Patrol & Incidents</h2>
                <div className="flex space-x-4">
                    <button
                        onClick={() => setShowPatrolForm(true)}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                        Add Patrol
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
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Active Patrols</h3>
                        <div className="mb-4">
                            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={center}
                                    zoom={13}
                                >
                                    {patrols
                                        .filter(patrol => patrol.status === 'active')
                                        .map(patrol => (
                                            <Marker
                                                key={patrol.id}
                                                position={{ lat: patrol.latitude, lng: patrol.longitude }}
                                            />
                                        ))}
                                </GoogleMap>
                            </LoadScript>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {patrols.map((patrol) => (
                                <li key={patrol.id} className="px-4 py-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-indigo-600">
                                                {patrol.location}
                                            </p>
                                            <p className="text-sm text-gray-500">Date: {patrol.date}</p>
                                            <p className="text-sm text-gray-500">Officer: {patrol.officer}</p>
                                            <p className="text-sm text-gray-500">Status: {patrol.status}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Incidents</h3>
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

            {showPatrolForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Add Patrol</h3>
                        <form onSubmit={handleAddPatrol}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date</label>
                                    <input
                                        type="date"
                                        value={newPatrol.date}
                                        onChange={(e) => setNewPatrol({ ...newPatrol, date: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Location</label>
                                    <input
                                        type="text"
                                        value={newPatrol.location}
                                        onChange={(e) => setNewPatrol({ ...newPatrol, location: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Officer</label>
                                    <input
                                        type="text"
                                        value={newPatrol.officer}
                                        onChange={(e) => setNewPatrol({ ...newPatrol, officer: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <select
                                        value={newPatrol.status}
                                        onChange={(e) => setNewPatrol({ ...newPatrol, status: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="active">Active</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-5 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPatrolForm(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                >
                                    Add Patrol
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showIncidentForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Add Incident</h3>
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
                                        <option value="theft">Theft</option>
                                        <option value="vandalism">Vandalism</option>
                                        <option value="trespassing">Trespassing</option>
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
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
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

export default SecurityPatrol; 