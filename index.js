
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceKey.json");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Firebase Admin Init
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// MongoDB URI
const uri =
  "mongodb+srv://food-lover-server:7LX6eEoglDBmqbDB@bd-developer.9vf4bfe.mongodb.net/?appName=BD-Developer";

const client = new MongoClient(uri);

// 🔐 VERIFY TOKEN MIDDLEWARE (FIXED)
const verifyToken = async (req, res, next) => {
  const authorization = req.headers.authorization;

  // Header check
  if (!authorization) {
    return res.status(401).send({
      message: "Unauthorized access. Token not found!",
    });
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      message: "Unauthorized access. Invalid token format!",
    });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.decoded = decoded;
    next();
  } catch (error) {
    return res.status(401).send({
      message: "Unauthorized access. Token invalid!",
    });
  }
};

async function run() {
  try {
    await client.connect();
    console.log("MongoDB connected successfully");

    const db = client.db("fooddb");
    const foodCollection = db.collection("foods");
    const downloadCollection = db.collection("downloads");

    // ✅ GET all foods (Public)
    app.get("/foods", async (req, res) => {
      const result = await foodCollection.find().toArray();
      res.send(result);
    });

    // ✅ GET single food (Protected)
    app.get("/foods/:id", async (req, res) => {
      const id = req.params.id;

      const result = await foodCollection.findOne({
        _id: new ObjectId(id),
      });

      res.send({
        success: true,
        result,
      });
    });

    // ✅ POST food
    app.post("/foods", async (req, res) => {
      const food = req.body;

      const result = await foodCollection.insertOne(food);
      res.send({
        success: true,
        result,
      });
    });

    // ✅ UPDATE food
    app.put("/foods/:id", async (req, res) => {
      const id = req.params.id;
      const updatedFood = req.body;

      const result = await foodCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedFood }
      );

      res.send({
        success: true,
        modifiedCount: result.modifiedCount,
      });
    });


    app.get("/my-models",verifyToken, async(req, res) => {
      const email = req.query.email
      const result = await foodCollection.find({userEmail:email}).toArray()
      res.send(result)
    })


    app.post("/downloads", async(req,res) => {
      const data = req.body
      const result = await downloadCollection.insertOne(data)
      res.send(result)
    })


    app.get("/my-downloads",verifyToken, async(req, res) => {
      const email = req.query.email
      const result = await downloadCollection.find({downloaded_by:email}).toArray()
      res.send(result)
    })



    app.get("/search", async(req,res) => {
      const search_text = req.query.search
      const result = await foodCollection.find({foodName: {$regex: search_text, $options: "i"}}).toArray()
      res.send(result)
    })



    // ✅ DELETE food
    app.delete("/foods/:id", async (req, res) => {
      const id = req.params.id;

      const result = await foodCollection.deleteOne({
        _id: new ObjectId(id),
      });

      res.send({
        success: true,
        deletedCount: result.deletedCount,
      });
    });
  } catch (error) {
    console.error(error);
  }
}

run();

// Root route
app.get("/", (req, res) => {
  res.send("Server is running successfully 🚀");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
