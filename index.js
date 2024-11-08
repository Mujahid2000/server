const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();


//middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mujahid.frqpuda.mongodb.net/?retryWrites=true&w=majority&appName=Mujahid`;

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
    const data = client.db('project_1').collection('course')
    const cart = client.db('project_1').collection('cart');
    const courseCollection = client.db('project_1').collection('course');
    const cartCollection = client.db('project_1').collection('cart');
    // Connect the client to the server	(optional starting in v4.7)

   app.get('/search', async(req, res) =>{
    const result = await courseCollection.find().toArray();
        res.send(result);
   })

   app.post('/cart', async (req, res) => {
    const cartData = req.body;
    const courseId = cartData.course._id;
  
    try {
      const insertResult = await cartCollection.insertOne(cartData);
      if (insertResult.acknowledged) {
        const updateResult = await courseCollection.updateOne(
          { _id: new ObjectId(courseId) }, 
          { $inc: { space: -1 } } 
        );
        res.send({
          cartInsertResult: insertResult,
          spaceUpdateResult: updateResult,
        });
      } else {
        res.status(500).send({ error: "Failed to insert data into the cart." });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send({ error: "An error occurred while processing the request." });
    }
  });

   app.get('/cart', async(req, res) =>{
    const result = await cartCollection.find().toArray();
    res.send(result)
   })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res) =>{
    res.send('running server')
})

app.listen(port, () =>{
    console.log(`server is running on port ${port}`);
})