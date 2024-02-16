
import './App.css';

import React, { useEffect, useState } from 'react';

function App() {

  const [logData, setLogData] = useState('');

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');


    socket.onmessage = (event) => {
      console.log('event:', event.data);
      setLogData((prevData) => prevData + event.data + '\n');
    };

    return () => {
      socket.close();
    };
  }, []);
  return (
    <div className="App">

      <h1>Real-time Log Watching</h1>
      <pre>{logData}</pre>
    </div>
  );
}

export default App;
