const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Reference to User model
  },
  username: { // Store the username
    type: String,
    required: true
  },
  concertId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Concert' // Reference to Concert model
  },
  ticketsBooked: {
    type: Number,
    required: true,
    min: 1,
    max: 3
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
