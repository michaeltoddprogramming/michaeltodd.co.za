const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.listen(9091);

// --------------------TEST PURPOSES----------------
app.use((req, res, next) => {
    console.log("New Request Made:");
    console.log("Host: ", req.hostname);
    console.log("Path: ", req.path);
    console.log("Method: ", req.method);
    next();
});

app.get("/", (req, res) => {
    res.render("index", { Title: "Home" });
});