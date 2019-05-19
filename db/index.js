const mongoose = require("mongoose");
let gracefulShutdown;
const dbURI = "mongodb://localhost:15593/SimpleContactsAppV1_0";

mongoose.connect(dbURI);

// CONNECTION EVENTS
mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to " + dbURI);
});
mongoose.connection.on('error', (err) => {
    console.log("Mongoose connection error: " + err);
});
mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected");
});


// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = (msg, callback) => {
    mongoose.connection.close(() => {
        console.log("Mongoose disconnected through " + msg);
        callback();
    });
};

// For app termination
process.on("SIGINT", () => {
    gracefulShutdown("app termination", () => {
        process.exit(0);
    });
});


// Bring in your schemas
require("./contact");
require("./message");
