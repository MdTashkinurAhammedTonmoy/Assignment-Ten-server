// const express = require("express");
// const cors = require("cors");
// const app = express();
// const port = 3000;

// app.use(cors());
// app.use(express.json());

// const { MongoClient, ServerApiVersion } = require("mongodb");
// // const uri = "mongodb+srv://food-lover-server:7LX6eEoglDBmqbDB@bd-developer.9vf4bfe.mongodb.net/?appName=BD-Developer";
// const uri =
//   "mongodb+srv://tonmoydb:umGAebda3yrUCUfl@bd-developer.9vf4bfe.mongodb.net/?appName=BD-Developer";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     //  await client.connect();

//     const db = client.db("food-db");
//     const modelCollection = db.collection("product");

//     app.get("/product", async (req, res) => {
//       const result = await modelCollection.find().toArray();
//       console.log(result);

//       res.send({});
//     });

//     // await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//   }
// }
// run().catch(console.dir);

// app.get("/", (req, res) => {
//   res.send("server is runing fine");
// });

// app.get("/hello", (req, res) => {
//   res.send("ami valo nei");
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = "mongodb+srv://food-lover-server:7LX6eEoglDBmqbDB@bd-developer.9vf4bfe.mongodb.net/?appName=BD-Developer";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("fooddb");
    const modelCollection = db.collection("foods");

    app.get("/foods", async (req, res) => {
      const result = await modelCollection.find().toArray();
      
      res.send(result);
    });

    app.get('/foods/:id',async(req,res) => {
      const {id} = req.params
      console.log(id)
      const objectId = new ObjectId(id)

      const result = await modelCollection.findOne({_id: objectId})

      res.send({
        success:true,
        result
      })
    })


    app.post('/foods', async (req,res) => {
      const data = req.body
      console.log(data)
      const result = await modelCollection.insertOne(data)
      res.send({
        success: true,
        result
      })
    })

    console.log("MongoDB connection established.");
  } catch (err) {
    console.error("MongoDB error:", err);
  }
}

run();

app.get("/", (req, res) => {
  res.send("server is running fine");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
