const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://food-lover-server:7LX6eEoglDBmqbDB@bd-developer.9vf4bfe.mongodb.net/?appName=BD-Developer";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("fooddb");
    const modelCollection = db.collection("foods");

    // ✅ GET all foods
    app.get("/foods", async (req, res) => {
      const result = await modelCollection.find().toArray();
      res.send(result);
    });

    // ✅ GET single food
    app.get("/foods/:id", async (req, res) => {
      const id = req.params.id;
      const result = await modelCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send({ success: true, result });
    });

    // ✅ POST food
    app.post("/foods", async (req, res) => {
      const result = await modelCollection.insertOne(req.body);
      res.send({ success: true, result });
    });

    // ✅ UPDATE food
    app.put("/foods/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;

      const result = await modelCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
      );

      res.send({
        success: true,
        modifiedCount: result.modifiedCount,
      });
    });

    // ✅ DELETE food (THIS WAS BROKEN BEFORE)
    app.delete("/foods/:id", async (req, res) => {
      const id = req.params.id;

      const result = await modelCollection.deleteOne({
        _id: new ObjectId(id),
      });

      res.send({
        success: true,
        deletedCount: result.deletedCount,
      });
    });

    console.log("MongoDB connected successfully");
  } catch (err) {
    console.log(err);
  }
}

run();

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

