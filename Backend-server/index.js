const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors")

const app = express();
const port = 4000;

const mongoURL = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
const dbName = 'sensor_data'; // Replace with your database name

app.use(cors())
// Connect to MongoDB
mongoose.connect(`${mongoURL}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Define a schema for the data
const dataSchema = new mongoose.Schema({
  
  temperature: {
    type: Number,
    required: true,
  },
  humidity: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});


// Create a model using the schema
const Data = mongoose.model('Data', dataSchema);


// Middleware to parse JSON requests
app.use(express.json());

// Handle the API endpoint for receiving data
app.get('/api/display-data', async (req, res) => {
    try {
      // Retrieve all data from MongoDB
      const data = await Data.find();
      return res.json(data);
    } catch (err) {
      console.error('Error retrieving data from MongoDB:', err);
      return res.sendStatus(500); // Send an error response
    }
});

// Handle the API endpoint for receiving data
app.get('/api/data', async (req, res) => {
  const { temperature, humidity } = req.query;
  console.log('Received data - Temperature:', temperature, '°C, Humidity:', humidity, '%');

  try {
    // Save the data to MongoDB
    const newData = new Data({ temperature: parseFloat(temperature), humidity: parseFloat(humidity) });
    await newData.save();
    console.log('Data saved to MongoDB');
    return res.sendStatus(200); // Send a success response
  } catch (err) {
    console.error('Error saving data to MongoDB:', err);
    return res.sendStatus(500); // Send an error response
  }
});



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
