const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

// Handle form submission
app.post("/send-email", (req, res) => {
    const { name, email, subject, message } = req.body;

    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service
        auth: {
            user: 'michaeltodd@colourmultimedia.com', // Your email
            pass: 'Michael53816!@' // Your email password
        }
    });

    // Email options
    const mailOptions = {
        from: email,
        to: 'michaeltodd981@gmail.com', // Recipient email
        subject: subject,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});