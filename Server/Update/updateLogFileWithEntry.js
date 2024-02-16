
const path = require("path");

const fs = require("fs");

const logFilePath = path.join(__dirname, "../logs", "log-file.log")

const appendLogEntry = () => {

    const timestamp = new Date().toISOString();
    const logLevel = getRandomLogLevel();
    const message = generateRandomMessage();

    const logEntry = `${timestamp} - ${logLevel}: ${message}\n`;

    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error('Error appending log entry:', err);
        } else {
            console.log('Log entry appended:', logEntry.trim());
        }
    });
}

function getRandomLogLevel() {
    const logLevels = ['INFO', 'ERROR', 'WARNING', 'SUCCESS'];
    return logLevels[Math.floor(Math.random() * logLevels.length)];
}

function generateRandomMessage() {
    const messages = [
        'Application started',

        'Something went wrong',
        'User logged in',
        'Disk space low',
        'Task completed successfully',
        'Login successfully'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}


module.exports = {
    appendLogEntry
}