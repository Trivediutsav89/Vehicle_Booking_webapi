import React, { useState, useEffect } from 'react';
import { vehicleApi, userApi, bookingApi, driverApi, paymentApi } from '../services/api';

const ApiDebug: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    const results: Record<string, any> = {};

    try {
      // Test backend health
      const healthResponse = await fetch('http://localhost:5015/api/test/health');
      results.health = {
        status: healthResponse.status,
        data: await healthResponse.json()
      };

      // Test each API endpoint
      const apis = [
        { name: 'vehicles', api: vehicleApi.getAll },
        { name: 'users', api: userApi.getAll },
        { name: 'bookings', api: bookingApi.getAll },
        { name: 'drivers', api: driverApi.getAll },
        { name: 'payments', api: paymentApi.getAll }
      ];

      for (const { name, api } of apis) {
        try {
          const response = await api();
          results[name] = {
            status: 'success',
            count: response.data?.length || 0,
            data: response.data?.slice(0, 2) // Show first 2 items
          };
        } catch (error: any) {
          results[name] = {
            status: 'error',
            error: error.message,
            response: error.response?.data
          };
        }
      }
    } catch (error: any) {
      results.general = {
        status: 'error',
        error: error.message
      };
    }

    setTestResults(results);
    setLoading(false);
  };

  useEffect(() => {
    testApi();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">API Debug Information</h2>
      
      <button 
        onClick={testApi}
        disabled={loading}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test API Connection'}
      </button>

      <div className="space-y-4">
        {Object.entries(testResults).map(([key, result]) => (
          <div key={key} className="border rounded p-3">
            <h3 className="font-semibold text-lg capitalize">{key}</h3>
            <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">Troubleshooting Tips:</h3>
        <ul className="text-sm space-y-1">
          <li>• Make sure your backend is running on port 5015</li>
          <li>• Check that your database has sample data</li>
          <li>• Verify CORS settings in backend</li>
          <li>• Check browser console for errors</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiDebug; 