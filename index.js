const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.i9yr5cu.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let parcelCollection;

async function run() {
  try {
    await client.connect();
    console.log("MongoDB connected ✅");

    const db = client.db("profastDB");
    parcelCollection = db.collection("parcels");

    /* =====================
        PARCEL APIs
    ====================== */

    // ➕ Add new parcel
    app.post("/parcels", async (req, res) => {
      try {
        const parcelData = req.body;

        const parcel = {
          ...parcelData,
          createdAt: new Date(),        // timestamp
          status: "pending",            // default status
        };

        const result = await parcelCollection.insertOne(parcel);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to create parcel" });
      }
    });

    // 📦 Get all parcels OR by user email
    app.get("/parcels", async (req, res) => {
      try {
        const email = req.query.email;
        let query = {};

        if (email) {
          query = { userEmail: email };
        }

        const result = await parcelCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch parcels" });
      }
    });

    // 📍 Get single parcel by ID (tracking)
    app.get("/parcels/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await parcelCollection.findOne({
          _id: new ObjectId(id),
        });
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Parcel not found" });
      }
    });

  } catch (error) {
    console.error(error);
  }
}

run();

// sample route
app.get("/", (req, res) => {
  res.send("Welcome to ProFast Server 🚚");
});

// start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
