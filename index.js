const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());

// sample route
app.get("/", (req, res) => {
  res.send("Welcome to ProFast Server");
});


// start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
