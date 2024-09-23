// Import Dependencies
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// Import Files/Functions
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// Dotenv Configuration
dotenv.config({ path: './config/.env' })

// MongoDB Connection 
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Testing
app.get('/', (req, res) => {
    res.send("<h1> Hello Haseeb.. This is runnung in docker! <h1>");
});

app.use("/api/auth", authRoutes);

// Server Running
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is Running in ${port}`);
})