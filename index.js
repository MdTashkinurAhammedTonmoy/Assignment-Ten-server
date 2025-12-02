const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())





const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://food-lover-server:7LX6eEoglDBmqbDB@bd-developer.9vf4bfe.mongodb.net/?appName=BD-Developer";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








app.get('/', (req,res) => {
    res.send('server is runing fine')
})

app.get('/hello', (req,res)=>{
    res.send('ami valo nei')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
