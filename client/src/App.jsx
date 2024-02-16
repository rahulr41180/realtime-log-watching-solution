
import './App.css';

import React, { useEffect, useState } from 'react';

function App() {
  const [logData, setLogData] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('https://realtime-log-watching-solution-server.vercel.app/');
    socket.onopen = () => {
      console.log('WebSocket connection opened');

    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLogData((prevData) => [...prevData, ...data]);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }

    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, []);
  return (
    <div className="App">
      <h1>Real-time Log Watching</h1>
      <ul>
        {logData.map((logEntry, index) => (

          <li key={index}>{logEntry}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;