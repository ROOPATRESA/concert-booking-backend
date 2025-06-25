const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/userModel');
const path = require('path');
const bcrypt = require('bcrypt');
const Booking = require('../models/bookingModel');
const Concert = require('../models/concertModel');
const qrcode = require('qrcode');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// ✅ Use env variable only, no fallback for production
const JWT_SECRET = process.env.JWT_SECRET;

// 🔐 Middleware: JWT Token Verification
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

// 🔐 Middleware: Admin Role Check
const verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden. Admin access only.' });
    }
    next();
};

// 📂 Multer Setup for Image Upload
const storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/create_concert_api', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const { concertName, dateTime, venue, ticketPrice, availableTickets } = req.body;

        if (!concertName || !dateTime || !venue || !ticketPrice || !availableTickets || !req.file) {
            return res.status(400).json({ error: 'All fields including image are required' });
        }

            const imagePath = `/uploads/${req.file.filename}`;

        const newConcert = new Concert({
            concertName,
            dateTime,
            venue,
            ticketPrice,
            availableTickets,
            image: imagePath,
        });

        await newConcert.save();
        res.status(201).json({ message: 'Concert created successfully', concert: newConcert });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating concert', details: error.message });
    }
});


// ✅ Get All Concerts
router.get('/retrieve_concert_api', async (req, res) => {
    try {
        const concerts = await Concert.find();
        const serialized = concerts.map(concert => ({
            id: concert._id,
            concertName: concert.concertName,
            dateTime: concert.dateTime,
            venue: concert.venue,
            ticketPrice: concert.ticketPrice,
            availableTickets: concert.availableTickets,
            image: concert.image
        }));
        res.status(200).json({ data: serialized });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET single concert by ID
router.get('/concert/:id', async (req, res) => {
  try {
    const concertId = req.params.id;
    const concert = await Concert.findById(concertId);

    if (!concert) {
      return res.status(404).json({ message: 'Concert not found' });
    }

    res.status(200).json({
      id: concert._id,
      concertName: concert.concertName,
      dateTime: concert.dateTime,
      venue: concert.venue,
      ticketPrice: concert.ticketPrice,
      availableTickets: concert.availableTickets,
      image: concert.image
    });
  } catch (error) {
    console.error('Get concert by ID error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// ✅ Update Concert - Admin Only
router.put('/update_concert_api/:id', verifyToken,  upload.single('image'), async (req, res) => {
    try {
        const { concertName, dateTime, venue, ticketPrice, availableTickets } = req.body;
        const concertId = req.params.id;

        if (!concertName || !dateTime || !venue || !ticketPrice || !availableTickets) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const image = req.file
            ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
            : undefined;

        const updatedConcert = await Concert.findByIdAndUpdate(
            concertId,
            {
                concertName,
                dateTime,
                venue,
                ticketPrice,
                availableTickets,
                ...(image && { image }) // only add image if it's uploaded
            },
            { new: true }
        );

        if (!updatedConcert) {
            return res.status(404).json({ error: 'Concert not found' });
        }

        res.status(200).json({ message: 'Concert updated successfully', concert: updatedConcert });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating concert', details: error.message });
    }
});

// ✅ Delete Concert - Admin Only
router.delete('/delete_concert_api/:id', verifyToken,  async (req, res) => {
    try {
        const concertId = req.params.id;

        const deletedConcert = await Concert.findByIdAndDelete(concertId);

        if (!deletedConcert) {
            return res.status(404).json({ error: 'Concert not found' });
        }

        res.status(200).json({ message: 'Concert deleted successfully', concert: deletedConcert });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting concert', details: error.message });
    }
});

router.post('/signup_api', async (req, res) => {
    console.log('Signup request body:', req.body);
    const { name, email, password, confirmPassword } = req.body;

    try {
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Signup successful. Please log in." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
});


router.post('/login_api', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and Password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role || 'user'
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', details: error.message });
    }
});


// POST /api/book_concert
router.post('/book_concert', verifyToken, async (req, res) => {
  try {
    const { concertId, tickets } = req.body;

    if (!concertId || !tickets) {
      return res.status(400).json({ message: 'concertId and tickets are required' });
    }

    // Check tickets is number and within allowed range
    const ticketsCount = parseInt(tickets);
    if (isNaN(ticketsCount) || ticketsCount < 1 || ticketsCount > 3) {
      return res.status(400).json({ message: 'Tickets must be between 1 and 3' });
    }

    // Check concert exists
    const concert = await Concert.findById(concertId);
    if (!concert) {
      return res.status(404).json({ message: 'Concert not found' });
    }

    if (concert.availableTickets < ticketsCount) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    // Decrease available tickets
    concert.availableTickets -= ticketsCount;
    await concert.save();

    // Create booking
    const booking = new Booking({
      userId: req.user.userId,
      username: req.user.email, // or req.user.name if stored
      concertId,
      ticketsBooked: ticketsCount
    });
    await booking.save();

    const formattedDate = new Date(concert.dateTime).toLocaleString();
    // Generate QR code content (can be a booking ID or a URL to booking info)
    // Generate QR code content
const qrData = `BookingID:${booking._id}\nUser:${booking.username}\nConcert:${concert.concertName}\nTickets:${ticketsCount}`;

 // Create folder for QR codes if it doesn't exist
    const qrDir = path.join(__dirname, '../public/qrcodes');
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true });
    }

const qrImagePath = path.join(qrDir, `qr_${booking._id}.png`);
// Save QR code as image file
await qrcode.toFile(qrImagePath, qrData);
const qrCodeImageUrl = await qrcode.toDataURL(qrData);
// Generate PDF ticket
    const ticketsDir = path.join(__dirname, '../tickets');
    if (!fs.existsSync(ticketsDir)) {
      fs.mkdirSync(ticketsDir, { recursive: true });
    }

// Generate PDF Ticket
const pdfPath = path.join(ticketsDir, `ticket_${booking._id}.pdf`);

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream(pdfPath));

doc.fontSize(20).text('Concert Ticket', { align: 'center' });
doc.moveDown();
doc.fontSize(14).text(`Booking ID: ${booking._id}`);
doc.text(`Name: ${req.user.email}`);
doc.text(`Concert: ${concert.concertName}`);
doc.text(`Date & Time: ${concert.dateTime}`);
doc.text(`Venue: ${concert.venue}`);
doc.text(`Tickets: ${ticketsCount}`);
doc.moveDown();
    if (fs.existsSync(qrImagePath)) {
      doc.image(qrImagePath, { fit: [200, 200], align: 'center' });
    } else {
      console.log("QR not found at", qrImagePath);
    }

doc.end();


// Send Email with Nodemailer
const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: "e5bdc6d9210730",
    pass: "5bc5504a139327"
  }
});

await transporter.sendMail({
  from: '"Concert Tickets" <no-reply@concerts.com>',
  to: req.user.email,
  subject: 'Your Concert Ticket',
  html: `
    <h2>Booking Confirmation</h2>
    <p><strong>Concert:</strong> ${concert.concertName}</p>
    <p><strong>Date & Time:</strong> ${concert.dateTime}</p>
    <p><strong>Venue:</strong> ${concert.venue}</p>
    <p><strong>Booked By:</strong> ${req.user.email}</p>
    <p><strong>Tickets:</strong> ${ticketsCount}</p>
    <br/>
    <p><strong>📌 Scan this QR Code at the Entrance:</strong></p>
    <img src="${qrCodeImageUrl}" alt="QR Code" width="200"/>
    <p>Attached is your ticket PDF with QR code.</p>
  `,
  attachments: [
    {
      filename: 'ticket.pdf',
      path: pdfPath
    }
  ]
});

// Clean up image and pdf files after sending
fs.unlinkSync(qrImagePath);
fs.unlinkSync(pdfPath);


    res.status(201).json({
      message: 'Booking successful',
      booking,
      qrCode: qrCodeImageUrl,
      pdfUrl: `/tickets/ticket_${booking._id}.pdf`
    });

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// DOWNLOAD TICKET API
router.get('/download-ticket/:bookingId', async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    console.log("🎫 Booking ID:", bookingId);

    const booking = await Booking.findById(bookingId)
      .populate('concertId')
      .populate('userId');

    if (!booking) {
      return res.status(404).send('❌ Booking not found');
    }

    const concert = booking.concertId;
    const user = booking.userId;

    // ✅ Ensure folders exist
    const ticketsDir = path.join(__dirname, '../tickets');
    const qrCodeDir = path.join(__dirname, '../public/qrcodes');

    if (!fs.existsSync(ticketsDir)) fs.mkdirSync(ticketsDir, { recursive: true });
    if (!fs.existsSync(qrCodeDir)) fs.mkdirSync(qrCodeDir, { recursive: true });

    // ✅ Generate QR code if not exists
    const qrCodePath = path.join(qrCodeDir, `qr_${bookingId}.png`);
    if (!fs.existsSync(qrCodePath)) {
      const qrData = `Concert: ${concert.concertName}\nDate: ${concert.dateTime}\nVenue: ${concert.venue}\nBooked By: ${user.name || user.email}`;
      await qrcode.toFile(qrCodePath, qrData);
          console.log("✅ QR Code saved at:", qrCodePath);
    }

    // ✅ Generate PDF
    const fileName = `ticket-${bookingId}.pdf`;
    const pdfPath = path.join(ticketsDir, fileName);
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    doc.fontSize(20).text('🎟️ Concert Ticket', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Concert: ${concert.concertName || 'N/A'}`);
    doc.text(`Date & Time: ${concert.dateTime ? new Date(concert.dateTime).toLocaleString() : 'N/A'}`);
    doc.text(`Venue: ${concert.venue || 'N/A'}`);
    doc.text(`Booked By: ${user.name || user.email}`);
    doc.text(`Tickets Booked: ${booking.ticketsBooked}`);

if (fs.existsSync(qrCodePath)) {
  doc.text('Scan QR Code:', { align: 'center' }).moveDown(1);

  doc.image(qrCodePath, doc.page.width / 2 - 75, doc.y, {
    width: 150,
    height: 150,
    align: 'center',
    valign: 'center'
  });
}

    doc.end();

    writeStream.on('finish', () => {
      res.download(pdfPath, fileName, err => {
        if (err) {
          console.error('❌ Download Error:', err);
          res.status(500).send('Download failed');
        } else {
          console.log('✅ Ticket sent:', fileName);
        }
      });
    });

  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).send('Server error');
  }
});


router.get('/book/:concertId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const concertId = req.params.concertId;

    // Find bookings for this concert and populate user info
    const bookings = await Booking.find({ concertId })
      .populate('userId', 'name email')
      .populate('concertId', 'concertName dateTime venue');

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this concert' });
    }

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings by concertId:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


const mongoose = require('mongoose'); // make sure you require mongoose at the top

router.post('/book/:concertId', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId; // from verifyToken middleware
    const concertId = req.params.concertId;
    const { tickets } = req.body; // number of tickets requested

    if (!mongoose.Types.ObjectId.isValid(concertId)) {
      return res.status(400).json({ message: 'Invalid concert ID' });
    }

    const ticketsCount = parseInt(tickets);
    if (!ticketsCount || ticketsCount < 1 || ticketsCount > 3) {
      return res.status(400).json({ message: 'You can book between 1 and 3 tickets only.' });
    }

    // Find concert
    const concert = await Concert.findById(concertId);
    if (!concert) {
      return res.status(404).json({ message: 'Concert not found' });
    }

    if (concert.availableTickets < ticketsCount) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    // Check existing booking by user for this concert
    const existingBooking = await Booking.findOne({ userId, concertId });
    const alreadyBookedTickets = existingBooking ? existingBooking.ticketsBooked : 0;

    if (alreadyBookedTickets + ticketsCount > 3) {
      return res.status(400).json({ message: 'You cannot book more than 3 tickets for this concert' });
    }

    // Update or create booking
    let booking;
    if (existingBooking) {
      existingBooking.ticketsBooked += ticketsCount;
      booking = await existingBooking.save();
    } else {
      booking = new Booking({
        concertId,
        userId,
        ticketsBooked: ticketsCount,
        username: req.user.email // assuming email is in token payload
      });
      await booking.save();
    }

    // Deduct tickets from concert
    concert.availableTickets -= ticketsCount;
    await concert.save();

    // Generate QR code data (simplified here)
    const qrData = `BookingID:${booking._id}\nUser:${req.user.email}\nConcert:${concert.concertName}\nTickets:${ticketsCount}`;
    const qrCodeUrl = await qrcode.toDataURL(qrData);

    // Optionally: generate PDF here (if you have a function)
    // For now, skip PDF generation or implement as you like

    res.status(201).json({
      message: 'Booking successful',
      booking: {
        concertName: concert.concertName,
        dateTime: concert.dateTime,
        venue: concert.venue,
        userName: req.user.email,
        tickets: booking.ticketsBooked,
        qrCodeUrl,
        // pdfUrl: 'your_pdf_url_if_any'
      }
    });

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get bookings for logged-in user
router.get('/my_bookings', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const bookings = await Booking.find({ userId }).populate('concertId');

    if (bookings.length === 0) {
      return res.status(200).json({ message: 'You have no bookings yet.', bookings: [] });
    }

    // Format response if needed
    const formattedBookings = bookings.map(b => ({
      bookingId: b._id,
      concertName: b.concertId.concertName,
      dateTime: b.concertId.dateTime,
      venue: b.concertId.venue,
      ticketsBooked: b.ticketsBooked,
      // Add any other details you want to send
    }));

    res.status(200).json({ bookings: formattedBookings });

  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Express.js example - Cancel booking by ID
router.delete('/cancel-booking/:bookingId', verifyToken, async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const userId = req.user.userId; // from your auth middleware

    // Find the booking and check if it belongs to the user
    const booking = await Booking.findOne({ _id: bookingId, userId });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not authorized' });
    }

    // Delete the booking
    await Booking.deleteOne({ _id: bookingId });

    res.json({ message: 'Booking canceled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/profile', verifyToken, async (req, res) => {
  try {
    // req.user is set by verifyToken and contains userId (or whatever you store in token)
    const user = await User.findById(req.user.userId).select('-password'); // exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
