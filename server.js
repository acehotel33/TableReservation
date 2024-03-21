require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import the Reservation model
const Reservation = require('./models/reservationModel');

const app = express();

// Middleware
app.use(express.json()); // for parsing application/json

// Enable CORS
app.use(cors());

// MongoDB connection URI
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB...');

        // Start listening for requests after connecting to MongoDB
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error('Could not connect to MongoDB...', err));


// Define your routes here...
// POST route to create a new reservation
app.post('/api/reservations', async (req, res) => {
    console.log(req.body); // Log the request body to see what data is received
    try {
        const newReservation = new Reservation(req.body);
        await newReservation.save();
        res.status(201).send(newReservation);
    } catch (error) {
        res.status(400).send(error);
    }
});

// GET route to fetch all reservations
app.get('/api/reservations', async (req, res) => {
    try {
        const reservations = await Reservation.find({});
        res.send(reservations);
    } catch (error) {
        res.status(500).send(error);
    }
});

// GET route to fetch a single reservation by ID
app.get('/api/reservations/:id', async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).send();
        }
        res.send(reservation);
    } catch (error) {
        res.status(500).send(error);
    }
});

// PATCH route to update a reservation by ID
app.patch('/api/reservations/:id', async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!reservation) {
            return res.status(404).send();
        }
        res.send(reservation);
    } catch (error) {
        res.status(400).send(error);
    }
});

// DELETE route to delete a reservation by ID
app.delete('/api/reservations/:id', async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.id);
        if (!reservation) {
            return res.status(404).send();
        }
        res.send(reservation);
    } catch (error) {
        res.status(500).send(error);
    }
});