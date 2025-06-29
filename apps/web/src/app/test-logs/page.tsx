'use client';

import { testServerLogging } from './actions';

export default function TestLogsPage() {
  const handleTestLogs = async () => {
    try {
      await testServerLogging();
      alert('Server logs have been sent! Check the server console and logs directory.');
    } catch (error) {
      alert('Error sending logs: ' + error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Logger Test Page</h1>
      <p className="mb-4">Click the button below to test server-side logging.</p>
      
      <button
        onClick={handleTestLogs}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test Server Logging
      </button>
      
      <p className="mt-8 text-sm text-gray-600">
        Logs should appear in:
        <br />- Server console
        <br />- logs/combined-*.log (if ENABLE_FILE_LOGS=true)
        <br />- logs/error-*.log (for errors only)
      </p>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Middleware Logs</h2>
        <p className="text-sm">
          Navigate to different pages to see middleware logs being captured.
          The middleware logs HTTP requests automatically.
        </p>
      </div>
    </div>
  );
}