const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zvedd86.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    const usersCollection = client.db('bkash').collection('users');
    console.log("Connected to MongoDB!");

    // Routes
    app.post('/api/register', async (req, res) => {
      const { name, pin, email, phone } = req.body;

      // Hash the PIN
      const salt = await bcrypt.genSalt(10);
      const hashedPin = await bcrypt.hash(pin, salt);

      const newUser = {
        name,
        pin: hashedPin,
        email,
        phone,
        status: 'pending',
      };

      try {
        const result = await usersCollection.insertOne(newUser);
        // Generate a JWT token
        const token = jwt.sign({ id: result.insertedId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'User registered successfully', token });
      } catch (error) {
        res.status(400).json({ message: 'Error registering user', error });
      }
    });

    app.post('/api/login', async (req, res) => {
      const { email, pin } = req.body;

      try {
        const user = await usersCollection.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(pin, user.pin);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
      } catch (error) {
        res.status(500).json({ message: 'Server error', error });
      }
    });

    app.get('/', (req, res) => {
      res.send('Server is running');
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } finally {
    // Uncomment the following line to close the connection after the server starts
    // await client.close();
  }
}
run().catch(console.dir);
