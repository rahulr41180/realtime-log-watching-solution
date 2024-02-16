
const express = require("express");

const http = require("http");
const WebSocket = require("ws");
const chokidar = require("chokidar");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
// console.log('server:', server)
const wss = new WebSocket.Server({ server });

const logFilePath = path.join(__dirname, "logs", "log-file.log")
// console.log('__dirname:', __dirname)
// console.log('logFilePath:', logFilePath);

const { appendLogEntry } = require("./Update/updateLogFileWithEntry.js");

// Sending last 10 lines of log-file when user land on page.
const readLastLine = (filePath, linesCount) => {

    try {
        const data = fs.readFileSync(filePath, "utf-8").split("\n");
        // console.log('data:', data)
        // console.log('data.length:', data.length)
        const lastLines = data.slice(Math.max((data.length - linesCount), 0))
        // console.log('lastLines:', lastLines)
        // console.log('lastLines:', lastLines.join());
        return lastLines
    } catch (error) {

        console.log('error:', error.message);
        return "";
    }
}
const initialLog = readLastLine(logFilePath, 10);

// setInterval(() => {

//     console.log("Hello");

//     appendLogEntry();
// },10000)

wss.on("connection", (ws) => {
    console.log("client has been connected");

    ws.send(initialLog);

    const watcher = chokidar.watch(logFilePath, { persistent: true });

    watcher.on('change', () => {
        const latestLog = readLastLine(logFilePath, 1);
        ws.send(latestLog);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        watcher.close();
    });

})

app.use(express.static(path.join(__dirname, '../client', 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'build', 'index.html'));
});
// console.log("path.join(__dirname, 'client', 'build', 'index.html'):", path.join(__dirname, '../client', 'build', 'index.html'))


server.listen(8080, async () => {
    try {
        console.log("Server listening on 8080 port");
    } catch (error) {
        console.log('error:', error.message);
    }
})