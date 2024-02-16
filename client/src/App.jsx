
import './App.css';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
// import dotenv from "dotenv";
// dotenv.config();

// console.log('process.env.NODE_ENV:', process.env.NODE_ENV)
// const socketUrl = 'https://realtime-log-watching-solution-server.vercel.app/';
const socketUrl = process.env.NODE_ENV === "development" ? 'http://localhost:8080' : "https://realtime-log-watching-solution-server.vercel.app/";

function App() {

  const [logData, setLogData] = useState([]);

  useEffect(() => {
    const socket = io(socketUrl, {
      withCredentials: true 
    });

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