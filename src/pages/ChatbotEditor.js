import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-hot-toast';

function ChatbotEditor() {
  const [flows, setFlows] = useState([]);
  const [responses, setResponses] = useState([]);
  const [newFlow, setNewFlow] = useState({
    name: '',
    description: '',
    triggers: [],
    steps: [],
  });
  const [newResponse, setNewResponse] = useState({
    intent: '',
    message: '',
    type: 'text',
    options: [],
  });
  const [showFlowForm, setShowFlowForm] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);

  useEffect(() => {
    fetchFlows();
    fetchResponses();
  }, []);

  const fetchFlows = async () => {
    try {
      const q = query(collection(db, 'chatbotFlows'));
      const querySnapshot = await getDocs(q);
      const flowsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFlows(flowsData);
    } catch (error) {
      toast.error('Error fetching flows');
    }
  };

  const fetchResponses = async () => {
    try {
      const q = query(collection(db, 'chatbotResponses'));
      const querySnapshot = await getDocs(q);
      const responsesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResponses(responsesData);
    } catch (error) {
      toast.error('Error fetching responses');
    }
  };

  const handleAddFlow = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'chatbotFlows'), newFlow);
      toast.success('Flow added successfully');
      setNewFlow({
        name: '',
        description: '',
        triggers: [],
        steps: [],
      });
      setShowFlowForm(false);
      fetchFlows();
    } catch (error) {
      toast.error('Error adding flow');
    }
  };

  const handleAddResponse = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'chatbotResponses'), newResponse);
      toast.success('Response added successfully');
      setNewResponse({
        intent: '',
        message: '',
        type: 'text',
        options: [],
      });
      setShowResponseForm(false);
      fetchResponses();
    } catch (error) {
      toast.error('Error adding response');
    }
  };

  const handleDeleteFlow = async (flowId) => {
    try {
      await deleteDoc(doc(db, 'chatbotFlows', flowId));
      toast.success('Flow deleted successfully');
      fetchFlows();
    } catch (error) {
      toast.error('Error deleting flow');
    }
  };

  const handleDeleteResponse = async (responseId) => {
    try {
      await deleteDoc(doc(db, 'chatbotResponses', responseId));
      toast.success('Response deleted successfully');
      fetchResponses();
    } catch (error) {
      toast.error('Error deleting response');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Chatbot Editor</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowFlowForm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Add Flow
          </button>
          <button
            onClick={() => setShowResponseForm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Add Response
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Flows</h3>
            <ul className="divide-y divide-gray-200">
              {flows.map((flow) => (
                <li key={flow.id} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-600">
                        {flow.name}
                      </p>
                      <p className="text-sm text-gray-500">{flow.description}</p>
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">
                          Triggers: {flow.triggers.join(', ')}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteFlow(flow.id)}
                      className="text-sm text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Responses</h3>
            <ul className="divide-y divide-gray-200">
              {responses.map((response) => (
                <li key={response.id} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-600">
                        {response.intent}
                      </p>
                      <p className="text-sm text-gray-500">{response.message}</p>
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">
                          Type: {response.type}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteResponse(response.id)}
                      className="text-sm text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {showFlowForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Flow</h3>
            <form onSubmit={handleAddFlow}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newFlow.name}
                    onChange={(e) => setNewFlow({ ...newFlow, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newFlow.description}
                    onChange={(e) => setNewFlow({ ...newFlow, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Triggers</label>
                  <input
                    type="text"
                    value={newFlow.triggers.join(',')}
                    onChange={(e) => setNewFlow({ ...newFlow, triggers: e.target.value.split(',') })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="comma,separated,triggers"
                    required
                  />
                </div>
              </div>
              <div className="mt-5 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowFlowForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Add Flow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showResponseForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Response</h3>
            <form onSubmit={handleAddResponse}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Intent</label>
                  <input
                    type="text"
                    value={newResponse.intent}
                    onChange={(e) => setNewResponse({ ...newResponse, intent: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    value={newResponse.message}
                    onChange={(e) => setNewResponse({ ...newResponse, message: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={newResponse.type}
                    onChange={(e) => setNewResponse({ ...newResponse, type: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                    <option value="button">Button</option>
                    <option value="quick_reply">Quick Reply</option>
                  </select>
                </div>
              </div>
              <div className="mt-5 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowResponseForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Add Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatbotEditor; 