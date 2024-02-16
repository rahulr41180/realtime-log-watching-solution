
import './App.css';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socketUrl = process.env.NODE_ENV === 'production'
  ? 'https://realtime-log-watching-solution-server.vercel.app/'
  : 'http://localhost:8080';

function App() {
  const [logData, setLogData] = useState([]);

  useEffect(() => {
    const socket = io(socketUrl);

    socket.on('initialLog', (initialLog) => {
      setLogData((prevData) => [...prevData, ...initialLog]);
    });

    socket.on('newLog', (newLog) => {
      setLogData((prevData) => [...prevData, ...newLog]);
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      socket.disconnect();
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


// import './App.css';

// import React, { useEffect, useState } from 'react';

// const socketUrl = process.env.NODE_ENV === 'production'
//   ? 'wss://realtime-log-watching-solution-server.vercel.app/'
//   : 'ws://localhost:8080';

// function App() {
//   const [logData, setLogData] = useState([]);

//   useEffect(() => {
//     const socket = new WebSocket(socketUrl);
//     socket.onopen = () => {
//       console.log('WebSocket connection opened');

//     };

//     socket.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         setLogData((prevData) => [...prevData, ...data]);
//       } catch (error) {
//         console.error('Error parsing JSON:', error);
//       }

//     };

//     socket.onclose = () => {
//       console.log('WebSocket connection closed');
//     };
  
//     socket.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };

//     return () => {
//       socket.close();
//     };
//   }, []);
//   return (
//     <div className="App">
//       <h1>Real-time Log Watching</h1>
//       <ul>
//         {logData.map((logEntry, index) => (
//           <li key={index}>{logEntry}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;
