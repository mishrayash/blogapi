const express = require("express");
const mongoose = require("mongoose");
const ConnectDB = require("./db");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const user = require("./routes/user");
const progress = require("./routes/progress");
const blog = require("./routes/blog");

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const port = 3001;

// Connect to MongoDB
ConnectDB();
const app = express();
const router = express.Router();

// Middleware to parse JSON
app.use(cors());
app.use(express.json());

// API endpoint 
app.use("/api/v1/user", user);
app.use("/api/v1/progress", progress);
app.use("/api/v1/blogs", blog);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
