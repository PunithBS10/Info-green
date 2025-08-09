import React from 'react';

export default function DebugData() {
  const [data, setData] = React.useState<any>(null);
  const [error, setError] = React.useState<string>('');

  const testFetch = async () => {
    try {
      console.log('Testing OWID fetch...');
      const response = await fetch('/api/owid-proxy');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      console.log('Raw CSV length:', text.length);
      
      // Try basic parsing
      const lines = text.trim().split('\n');
      console.log('CSV lines:', lines.length);
      console.log('Header:', lines[0]);
      console.log('First data row:', lines[1]);
      
      setData({
        csvLength: text.length,
        totalLines: lines.length,
        header: lines[0],
        firstRow: lines[1]
      });
    } catch (err) {
      console.error('Debug fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Data Loading</h1>
      
      <button 
        onClick={testFetch}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test OWID Data Fetch
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded">
          <h3 className="font-bold text-red-800">Error:</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {data && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded">
          <h3 className="font-bold text-green-800">Success:</h3>
          <pre className="text-sm text-green-700">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}