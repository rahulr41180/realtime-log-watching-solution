
const express = require("express");

const http = require("http");
const WebSocket = require("ws");
const chokidar = require("chokidar");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const server = http.createServer(app);


const wss = new WebSocket.Server({ server });

const logFilePath = path.join(__dirname, "logs", "log-file.log")

// Middleware
dotenv.config();
app.use(cors());

const { appendLogEntry } = require("./Update/updateLogFileWithEntry.js");

// Connecting to mupltiple user
const connectedClients = new Set();


// Sending last 10 lines of log-file when user land on page.
const readLastLine = (filePath, linesCount) => {
    try {
        // read the log-file and remove the empty string or falsy value with .filter(Boolean);
        const data = fs.readFileSync(filePath, "utf-8").split("\n").filter(Boolean);
        const lastLines = data.slice(Math.max((data.length - linesCount), 0))
        return lastLines
    } catch (error) {
        console.log('error:', error.message);

        return [];
    }
}

const initialLog = readLastLine(logFilePath, 10);

// Updating new data to log-file.log
setInterval(() => {
    appendLogEntry();

}, 5000)

// Stablized connection between client and server
wss.on("connection", (ws) => {
    console.log("client has been connected");
    connectedClients.add(ws);

    ws.send(JSON.stringify(initialLog));

    const watcher = chokidar.watch(logFilePath, { persistent: true });

    watcher.on('change', () => {
        const latestLog = readLastLine(logFilePath, 1);
        broadcastToClients(ws, latestLog);
    });

    ws.on('close', () => {
        console.log('Client disconnected');

        connectedClients.delete(ws);
        watcher.close();
    });
})

// Sending data to multiple user
const broadcastToClients = (client, logData) => {
    const jsonString = JSON.stringify(logData);
        if (client.readyState === WebSocket.OPEN) {
            
            client.send(jsonString);
        }
};

app.use(express.static(path.join(__dirname, '../client', 'build')));

app.get('/log', async (req, res) => {
    try {
        res.status(200).sendFile(path.join(__dirname, '../client', 'build', 'index.html'));
    } catch(error) {
        res.status(500).send({
            status : false,
            error : error.message
        })
    }

});

app.get("/", async (req, res) => {
    res.status(200).send({
        status : true
    })
})

// Start Server on 8080 PORT
const PORT = process.env.PORT || 8080
server.listen(PORT, async () => {
    try {
        console.log(`Server listening on ${PORT} port`);
    } catch (error) {
        console.log('error:', error.message);
    }
})

module.exports = { app }