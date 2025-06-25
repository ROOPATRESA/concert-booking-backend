const express = require('express');
const QRCode = require('qrcode');
const PDFDocument = require("pdfkit");
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const router = express.Router();
const Booking = require('../models/bookingModel');
const Concert = require('../models/concertModel');
const User = require('../models/userModel');


// ✅ Route to book a concert
router.post('/book/:id', async (req, res) => {
    try {
        const concertId = req.params.id;
        const { username, tickets } = req.body;
        const ticketCount = parseInt(tickets);

        console.log("Booking request received:", { concertId, username, tickets });

        if (ticketCount < 1 || ticketCount > 3) {
            return res.status(400).send('You can book between 1 to 3 tickets only.');
        }

        const concert = await Concert.findById(concertId);
        if (!concert) return res.status(404).send('Concert not found.');

        if (concert.availableTickets < ticketCount) {
            return res.status(400).send(`Only ${concert.availableTickets} tickets left.`);
        }

        const user = await User.findOne({ name: new RegExp("^" + username + "$", "i") });
        if (!user) return res.status(404).send('User not found.');


            console.log('Booking request received');
            console.log('Request params:', req.params);
            console.log('Request body:', req.body);

        // ✅ Save booking
        const newBooking = new Booking({
            userId: user._id,
            username: user.name,
            concertId: concert._id,
            ticketsBooked: ticketCount
        });
        console.log('Saving booking:', newBooking);
        await newBooking.save();
         console.log('Booking saved successfully!');

        // ✅ Update available tickets
        concert.availableTickets -= ticketCount;
        await concert.save();

        // ✅ Generate QR Code
        const ticketDetails = `
        Concert: ${concert.concertName}
        Date & Time: ${new Date(concert.dateTime).toLocaleString()}
        Venue: ${concert.venue}
        Booked by: ${user.name}
        Tickets: ${ticketCount}
        `;

        const qrCode = await QRCode.toDataURL(ticketDetails); // Base64 image

        // ✅ Send email with QR Code
        await sendBookingEmail(user.email, qrCode, concert, user, ticketCount);

        // ✅ Redirect to confirmation page
        res.render('confirmation', {
            concert,
            user,
            booking: newBooking,  // ✅ Pass booking data
            qrCode
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing booking');
    }
});


// ✅ Route to download PDF
router.get('/download/:bookingId', async (req, res) => {
    try {
        const bookingId = req.params.bookingId;

        // ✅ Find booking details
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).send('Booking not found.');

        const concert = await Concert.findById(booking.concertId);
        if (!concert) return res.status(404).send('Concert not found.');

        const user = await User.findById(booking.userId);
        if (!user) return res.status(404).send('User not found.');

        // ✅ Generate QR Code Image and Save it
        const qrCodePath = path.join(__dirname, `../tickets/QR_${bookingId}.png`);
        await QRCode.toFile(qrCodePath, `Concert: ${concert.concertName}\nDate: ${concert.dateTime}\nVenue: ${concert.venue}`);

        // ✅ Create PDF
        const pdfPath = path.join(__dirname, `../tickets/Ticket_${bookingId}.pdf`);
        const doc = new PDFDocument();
        const writeStream = fs.createWriteStream(pdfPath);

        doc.pipe(writeStream);
        doc.fontSize(20).text("🎟️ Concert Ticket", { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Concert: ${concert.concertName}`);
        doc.text(`Date & Time: ${new Date(concert.dateTime).toLocaleString()}`);
        doc.text(`Venue: ${concert.venue}`);
        doc.text(`Booked By: ${user.name}`);
        doc.text(`Tickets Booked: ${booking.ticketsBooked}`);
        doc.moveDown();

        // ✅ Add QR Code Image
        doc.image(qrCodePath, { fit: [150, 150], align: 'center' });

        doc.end();

        // ✅ Wait for PDF to be written before sending response
        writeStream.on('finish', () => {
            res.download(pdfPath, `Concert_Ticket_${bookingId}.pdf`, (err) => {
                if (err) console.error("Download Error:", err);
                fs.unlinkSync(pdfPath); // Delete after download
                fs.unlinkSync(qrCodePath); // Delete QR image
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating PDF');
    }
});

async function sendBookingEmail(toEmail, qrCode, concert, user, tickets) {
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "e5bdc6d9210730",
            pass: "5bc5504a139327"
        }
    });

    const mailOptions = {
        from: '"Concert Booking" <noreply@concert.com>',
        to: toEmail,
        subject: "🎟️ Your Concert Ticket",
        html: `
            <h2>Booking Confirmation</h2>
            <p>Concert: <strong>${concert.concertName}</strong></p>
            <p>Date & Time: <strong>${concert.dateTime}</strong></p>
            <p>Venue: <strong>${concert.venue}</strong></p>
            <p>Booked By: <strong>${user.name}</strong></p>
            <p>Tickets: <strong>${tickets}</strong></p>
            <h3>📌 Scan this QR Code at the Entrance:</h3>
            <img src="${qrCode}" width="200" />
        `,
    };

    try {
        await transport.sendMail(mailOptions); // ✅ Use `transport`, NOT `transporter`
        console.log("✅ Email sent successfully to:", toEmail);
    } catch (error) {
        console.error("❌ Error sending email:", error.message);
    }
}


// DELETE booking by id - only user who booked it can cancel
router.delete('/bookings/:id',  async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user._id;  // from your auth middleware

    // Find booking by id
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking belongs to logged-in user
    if (booking.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Delete booking
    await Booking.findByIdAndDelete(bookingId);

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;
