const mongoose = require('mongoose');

// Define the reservation schema
const reservationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true }
});

// Create the model from the schema
const Reservation = mongoose.model('Reservation', reservationSchema);

// Export the model
module.exports = Reservation;
