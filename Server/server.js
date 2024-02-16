
const express = require("express");
const http = require("http");
const chokidar = require("chokidar");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

dotenv.config();
app.use(cors());

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000'],
        methods: ["GET", "POST"]
    },
});


const logFilePath = path.join(__dirname, "logs", "log-file.log");

const { appendLogEntry } = require("./Update/updateLogFileWithEntry.js");

// Connecting to multiple users
const connectedClients = new Set();

// Sending last 10 lines of log-file when a user lands on the page.
const readLastLine = (filePath, linesCount) => {

    try {
        const data = fs.readFileSync(filePath, "utf-8").split("\n").filter(Boolean);
        const lastLines = data.slice(Math.max(data.length - linesCount, 0));
        return lastLines;
    } catch (error) {
        console.log("error:", error.message);
        return [];
    }
};

// const initialLog = readLastLine(logFilePath, 10);

// Updating new data to log-file.log
setInterval(() => {
    appendLogEntry();
}, 5000);

// Stabilized connection between client and server
io.on("connection", (socket) => {

    console.log("client has been connected");
    connectedClients.add(socket);

    socket.emit("initialLog", readLastLine(logFilePath, 10));


    const watcher = chokidar.watch(logFilePath, { persistent: true });

    watcher.on("change", () => {

        const latestLog = readLastLine(logFilePath, 1);
        broadcastToClients(socket, latestLog);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
        connectedClients.delete(socket);
        watcher.close();
    });
});

// Sending data to multiple users
const broadcastToClients = (socket, logData) => {
    io.emit("newLog", logData);
};

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'https://realtime-log-watching-solution-client.vercel.app');

//     res.header('Access-Control-Allow-Methods', 'GET, POST'); 
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });


// Handle CORS preflight requests
// app.options('*', cors());


app.use(express.static(path.join(__dirname, "../client/build")));


app.get("/", async (req, res) => {
    try {
        res.status(200).sendFile(path.join(__dirname, "../client/build/index.html",));
    } catch (error) {
        res.status(500).send({
            status: false,
            error: error.message,
        });
    }

});

// Start Server on 8080 PORT
const PORT = process.env.PORT || 8080;

http.listen(PORT, async () => {
    try {
        console.log(`Server listening on ${PORT} port`);
    } catch (error) {

        console.log("error:", error.message);
    }
});

module.exports = { app };