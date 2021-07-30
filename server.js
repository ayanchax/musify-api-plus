const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const path = require("path");
const router = require("./routes/route");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");
const https = require("https");
//1 add middleware setup
app.use(cors());
app.use(bodyparser.json());

//2 static files setup: __dirname is the project root.
// Our static file location are stored in public folder under root directory
app.use(express.static(path.join(__dirname, "public")));

//3 api/router setup
const key = process.env.API_KEY;
app.use("/api/" + key, router);

// 4 Listening to the express server.
// this method runs at the entry point of starting the node js applications
const port = process.env.PORT ? process.env.PORT : 3000;
app.listen(port, () => {
    console.log("API started at port: " + port);
});