const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zvedd86.mongodb.net/bkash?retryWrites=true&w=majority`;

// MongoDB Client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connect to MongoDB
async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    // Select database and collection
    const database = client.db('bkash');
    const usersCollection = database.collection('users');

    // Routes
    app.post('/api/register', async (req, res) => {
      const { name, pin, email, phone } = req.body;

      const newUser = {
        name,
        pin,
        email,
        phone,
        status: 'pending'
      };

      try {
        const result = await usersCollection.insertOne(newUser);
        console.log("User registered successfully:", result.insertedId);
        res.status(201).json({ message: 'User registered successfully' });
      } catch (error) {
        console.error("Error registering user:", error);
        res.status(400).json({ message: 'Error registering user', error });
      }
    });

    // Start server
    app.get('/', (req, res)=>{
        res.send('Server is running');
    })
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

// Start the application
run().catch(console.dir);
