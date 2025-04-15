import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-hot-toast';

function Settings() {
  const [settings, setSettings] = useState({
    notificationPreferences: {
      email: true,
      push: true,
      sms: false,
    },
    alertThresholds: {
      high: 5,
      medium: 10,
      low: 15,
    },
    systemPreferences: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC',
    },
    securitySettings: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordPolicy: {
        minLength: 8,
        requireSpecialChar: true,
        requireNumber: true,
      },
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'admin'));
      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data());
      }
    } catch (error) {
      toast.error('Error fetching settings');
    }
  };

  const handleSaveSettings = async () => {
    try {
      await updateDoc(doc(db, 'settings', 'admin'), settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Error saving settings');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notificationPreferences.email}
                onChange={(e) => setSettings({
                  ...settings,
                  notificationPreferences: {
                    ...settings.notificationPreferences,
                    email: e.target.checked,
                  },
                })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">Email Notifications</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notificationPreferences.push}
                onChange={(e) => setSettings({
                  ...settings,
                  notificationPreferences: {
                    ...settings.notificationPreferences,
                    push: e.target.checked,
                  },
                })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">Push Notifications</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notificationPreferences.sms}
                onChange={(e) => setSettings({
                  ...settings,
                  notificationPreferences: {
                    ...settings.notificationPreferences,
                    sms: e.target.checked,
                  },
                })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">SMS Notifications</label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Alert Thresholds</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">High Priority Threshold (minutes)</label>
              <input
                type="number"
                value={settings.alertThresholds.high}
                onChange={(e) => setSettings({
                  ...settings,
                  alertThresholds: {
                    ...settings.alertThresholds,
                    high: parseInt(e.target.value),
                  },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Medium Priority Threshold (minutes)</label>
              <input
                type="number"
                value={settings.alertThresholds.medium}
                onChange={(e) => setSettings({
                  ...settings,
                  alertThresholds: {
                    ...settings.alertThresholds,
                    medium: parseInt(e.target.value),
                  },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Low Priority Threshold (minutes)</label>
              <input
                type="number"
                value={settings.alertThresholds.low}
                onChange={(e) => setSettings({
                  ...settings,
                  alertThresholds: {
                    ...settings.alertThresholds,
                    low: parseInt(e.target.value),
                  },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Preferences</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Theme</label>
              <select
                value={settings.systemPreferences.theme}
                onChange={(e) => setSettings({
                  ...settings,
                  systemPreferences: {
                    ...settings.systemPreferences,
                    theme: e.target.value,
                  },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Language</label>
              <select
                value={settings.systemPreferences.language}
                onChange={(e) => setSettings({
                  ...settings,
                  systemPreferences: {
                    ...settings.systemPreferences,
                    language: e.target.value,
                  },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Timezone</label>
              <select
                value={settings.systemPreferences.timezone}
                onChange={(e) => setSettings({
                  ...settings,
                  systemPreferences: {
                    ...settings.systemPreferences,
                    timezone: e.target.value,
                  },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="PST">Pacific Time</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.securitySettings.twoFactorAuth}
                onChange={(e) => setSettings({
                  ...settings,
                  securitySettings: {
                    ...settings.securitySettings,
                    twoFactorAuth: e.target.checked,
                  },
                })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">Enable Two-Factor Authentication</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.securitySettings.sessionTimeout}
                onChange={(e) => setSettings({
                  ...settings,
                  securitySettings: {
                    ...settings.securitySettings,
                    sessionTimeout: parseInt(e.target.value),
                  },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password Policy</label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.securitySettings.passwordPolicy.requireSpecialChar}
                    onChange={(e) => setSettings({
                      ...settings,
                      securitySettings: {
                        ...settings.securitySettings,
                        passwordPolicy: {
                          ...settings.securitySettings.passwordPolicy,
                          requireSpecialChar: e.target.checked,
                        },
                      },
                    })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Require Special Characters</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.securitySettings.passwordPolicy.requireNumber}
                    onChange={(e) => setSettings({
                      ...settings,
                      securitySettings: {
                        ...settings.securitySettings,
                        passwordPolicy: {
                          ...settings.securitySettings.passwordPolicy,
                          requireNumber: e.target.checked,
                        },
                      },
                    })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Require Numbers</label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Minimum Password Length</label>
                  <input
                    type="number"
                    value={settings.securitySettings.passwordPolicy.minLength}
                    onChange={(e) => setSettings({
                      ...settings,
                      securitySettings: {
                        ...settings.securitySettings,
                        passwordPolicy: {
                          ...settings.securitySettings.passwordPolicy,
                          minLength: parseInt(e.target.value),
                        },
                      },
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings; 