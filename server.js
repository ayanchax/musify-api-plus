//importing modules for server side code
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const path = require("path");
const router = require("./routes/route");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

//1 add middleware setup
app.use(cors());
app.use(bodyparser.json());

//2 static files setup __dirname is the project root. Our static file location are stored in public folder under root directory
// All the display on the UI will be refered from this location's index.html keeping it as a display wrapper for all the various display rendering
app.use(express.static(path.join(__dirname, "public")));

// api/router setup
const key = process.env.API_KEY;
app.use("/api/" + key, router);

// this method runs at the entry point of starting the applications
// Listening to the express server.
const port = process.env.PORT;
app.listen(port, () => {
    console.log("API started at port: " + port);
});