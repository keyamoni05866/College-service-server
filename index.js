const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app  = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nn0l6mi.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
const collegeCollection = client.db('collegService').collection('colleges')
const admissionCollection = client.db('collegService').collection('admission')

app.get('/colleges', async(req, res)=>{
     const cursor = collegeCollection.find();
     const result = await cursor.toArray();
     res.send(result);
})
app.get("/colleges/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await collegeCollection.findOne(query);
  res.send(result);
});
app.get("/3colleges", async (req, res) => {
  const cursor = collegeCollection.find().limit(3);
  const result = await cursor.toArray();
  res.send(result);
});

app.post("/admission", async (req, res) => {
  const admissionInfo = req.body;
  const result = await admissionCollection.insertOne(admissionInfo);
  res.send(result);
});

app.get("/myCollege", async (req, res) => {
  const candidateEmail= req.query.email;
  const query = { candidateEmail };
  const cursor = admissionCollection.find(query);
  const result = await cursor.toArray();
  res.send(result);
});


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('college service information is coming')
})

app.listen(port, ()=>{
    console.log(`College service website is running ${port}`)
})