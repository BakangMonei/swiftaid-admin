import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-hot-toast';

function GBVReports() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState({
    status: 'all',
    urgency: 'all',
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [notes, setNotes] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    try {
      let q = query(collection(db, 'gbvReports'));
      
      if (filter.status !== 'all') {
        q = query(q, where('status', '==', filter.status));
      }
      
      if (filter.urgency !== 'all') {
        q = query(q, where('urgency', '==', filter.urgency));
      }

      const querySnapshot = await getDocs(q);
      const reportsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(reportsData);
    } catch (error) {
      toast.error('Error fetching reports');
    }
  };

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      const reportRef = doc(db, 'gbvReports', reportId);
      await updateDoc(reportRef, {
        status: newStatus,
      });
      toast.success('Report status updated');
      fetchReports();
    } catch (error) {
      toast.error('Error updating report status');
    }
  };

  const handleAssign = async (reportId) => {
    if (!assignedTo.trim()) {
      toast.error('Please select a team to assign');
      return;
    }

    try {
      const reportRef = doc(db, 'gbvReports', reportId);
      await updateDoc(reportRef, {
        assignedTo,
        status: 'in_progress',
      });
      toast.success('Report assigned successfully');
      setAssignedTo('');
      setSelectedReport(null);
      fetchReports();
    } catch (error) {
      toast.error('Error assigning report');
    }
  };

  const handleAddNote = async (reportId) => {
    if (!notes.trim()) {
      toast.error('Please enter a note');
      return;
    }

    try {
      const reportRef = doc(db, 'gbvReports', reportId);
      await updateDoc(reportRef, {
        notes: notes,
      });
      toast.success('Note added successfully');
      setNotes('');
      setSelectedReport(null);
      fetchReports();
    } catch (error) {
      toast.error('Error adding note');
    }
  };

  const filteredReports = reports.filter(report => {
    if (filter.status !== 'all' && report.status !== filter.status) return false;
    if (filter.urgency !== 'all' && report.urgency !== filter.urgency) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">GBV Reports</h2>
        <div className="flex space-x-4">
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <select
            value={filter.urgency}
            onChange={(e) => setFilter({ ...filter, urgency: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Urgency</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredReports.map((report) => (
            <li key={report.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                        report.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                        report.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {report.urgency}
                      </span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-indigo-600">
                        {report.type}
                      </p>
                      <p className="text-sm text-gray-500">{report.location}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedReport({ ...report, action: 'note' })}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Add Note
                    </button>
                    <button
                      onClick={() => setSelectedReport({ ...report, action: 'assign' })}
                      className="text-green-600 hover:text-green-900"
                    >
                      Assign
                    </button>
                    {report.status !== 'resolved' && (
                      <button
                        onClick={() => handleStatusChange(report.id, 'resolved')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Resolve
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
                      {report.timestamp.toDate().toLocaleString()}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      report.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      report.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                </div>
                {report.notes && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Notes: {report.notes}</p>
                  </div>
                )}
                {report.assignedTo && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Assigned to: {report.assignedTo}</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {selectedReport.action === 'note' ? 'Add Note' : 'Assign Report'}
            </h3>
            {selectedReport.action === 'note' ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows="4"
                placeholder="Enter your notes here..."
              />
            ) : (
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Team</option>
                <option value="counseling">Counseling Team</option>
                <option value="security">Security Team</option>
                <option value="medical">Medical Team</option>
              </select>
            )}
            <div className="mt-5 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedReport(null);
                  setNotes('');
                  setAssignedTo('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => selectedReport.action === 'note' 
                  ? handleAddNote(selectedReport.id)
                  : handleAssign(selectedReport.id)
                }
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                {selectedReport.action === 'note' ? 'Save Note' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GBVReports; 