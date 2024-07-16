const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;


//password: IhtA8VHDYpgjbpix
//user name: bkash

//Middleware:
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zvedd86.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);


// Routes
app.post('/api/register', async (req, res) => {
    const { name, pin, mobileNumber, email } = req.body;
  
    const newUser = {
      name,
      pin,
      mobileNumber,
      email,
      status: 'pending'
    };
  
    try {
      const result = await db.collection('users').insertOne(newUser);
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error registering user', error });
    }
  });




app.get('/', (req, res)=>{
    res.send('Server is running')
})

app.listen(port, ()=>{
    console.log(`Port is running at ${port}`);
} )
