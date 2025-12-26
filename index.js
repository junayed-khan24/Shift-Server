// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ObjectId } = require("mongodb");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.i9yr5cu.mongodb.net`;

const client = new MongoClient(uri);

let parcels;

async function run() {
  try {
    await client.connect();
    console.log("MongoDB connected ✅");

    const db = client.db("profastDB");
    parcels = db.collection("parcels");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
run();

// ROUTES

// Server test
app.get("/", (req, res) => {
  res.send("ProFast Server Running 🚚");
});

// ➕ POST parcel
app.post("/parcels", async (req, res) => {
  try {
    const parcel = {
      ...req.body,
      createdAt: new Date(),
    };

    const result = await parcels.insertOne(parcel);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to create parcel" });
  }
});

// 📦 GET parcels (all or by email) - safe + case-insensitive
app.get("/parcels", async (req, res) => {
  try {
    const userEmail = req.query.email;

    const query = userEmail ? { created_by: userEmail } : {};
    const options = {
      sort: { createdAt: -1 },
    };

    const result = await parcels.find(query, options).toArray();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to fetch parcels" });
  }
});



// 📍 GET single parcel by id
app.get("/parcels/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await parcels.findOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to fetch parcel" });
  }
});

// start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
