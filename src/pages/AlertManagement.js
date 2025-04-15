import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
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

function AlertManagement() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState({
    type: 'all',
    status: 'all',
  });
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchAlerts();
  }, [filter]);

  const fetchAlerts = async () => {
    try {
      let q = query(collection(db, 'emergencyAlerts'));
      
      if (filter.type !== 'all') {
        q = query(q, where('emergencyType', '==', filter.type));
      }
      
      if (filter.status !== 'all') {
        q = query(q, where('status', '==', filter.status));
      }

      const querySnapshot = await getDocs(q);
      const alertsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAlerts(alertsData);
    } catch (error) {
      toast.error('Error fetching alerts');
    }
  };

  const handleStatusChange = async (alertId, newStatus) => {
    try {
      const alertRef = doc(db, 'emergencyAlerts', alertId);
      await updateDoc(alertRef, {
        status: newStatus,
      });
      toast.success('Alert status updated');
      fetchAlerts();
    } catch (error) {
      toast.error('Error updating alert status');
    }
  };

  const handleAddNote = async (alertId) => {
    if (!notes.trim()) {
      toast.error('Please enter a note');
      return;
    }

    try {
      const alertRef = doc(db, 'emergencyAlerts', alertId);
      await updateDoc(alertRef, {
        notes: notes,
      });
      toast.success('Note added successfully');
      setNotes('');
      setSelectedAlert(null);
      fetchAlerts();
    } catch (error) {
      toast.error('Error adding note');
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter.type !== 'all' && alert.emergencyType !== filter.type) return false;
    if (filter.status !== 'all' && alert.status !== filter.status) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Alert Management</h2>
        <div className="flex space-x-4">
          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="Medical Emergency">Medical</option>
            <option value="Security">Security</option>
            <option value="Fire">Fire</option>
            <option value="GBV">GBV</option>
          </select>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredAlerts.map((alert) => (
              <li key={alert.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          alert.status === 'pending' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {alert.status}
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-indigo-600">
                          {alert.emergencyType}
                        </p>
                        <p className="text-sm text-gray-500">{alert.location}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedAlert(alert)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Add Note
                      </button>
                      {alert.status === 'pending' ? (
                        <button
                          onClick={() => handleStatusChange(alert.id, 'resolved')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Resolve
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(alert.id, 'pending')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reopen
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <svg
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {alert.timestamp.toDate().toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {alert.notes && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Notes: {alert.notes}</p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Active Alerts Map</h3>
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={13}
              >
                {filteredAlerts
                  .filter(alert => alert.status === 'pending')
                  .map(alert => (
                    <Marker
                      key={alert.id}
                      position={{ lat: alert.latitude, lng: alert.longitude }}
                    />
                  ))}
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      </div>

      {selectedAlert && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Note</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows="4"
              placeholder="Enter your notes here..."
            />
            <div className="mt-5 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedAlert(null);
                  setNotes('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAddNote(selectedAlert.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AlertManagement; 