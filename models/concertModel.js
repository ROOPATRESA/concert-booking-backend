const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema({
   
    concertName: {
        type: String,
        required: [true, 'Concert Name is required'],
        maxlength: [500, 'Concert Name cannot exceed 500 characters']
    },
    dateTime: {
        type: String,
        required: [true, 'Date and Time is required']
    },
    venue: {
        type: String,
        required: [true, 'Venue is required'],
       
    },

    ticketPrice: {
      type: Number,
      required: [true, 'Ticket price is required'],
      min: [0, 'Ticket price cannot be negative']
  },

  availableTickets: {
    type: Number,
    required: [true, 'Available tickets are required'],
    min: [1, 'There must be at least one ticket']
  },

  image: {
    type: String,
    required: false,  // Change from 'true' to 'false' to make image optional
    default: ''
}
});

const Concert = mongoose.model('Concert', concertSchema);
module.exports = Concert;


