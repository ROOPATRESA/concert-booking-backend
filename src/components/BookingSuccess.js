// BookingSuccess.js
import React from "react";

const BookingSuccess = ({ message, booking, qrCode, pdfUrl }) => {
  return (
    <div className="container mt-5 text-center">
      <h2 className="text-success">{message}</h2>
      <p><strong>Concert ID:</strong> {booking.concertId}</p>
      <p><strong>Tickets Booked:</strong> {booking.ticketsBooked}</p>
      <p><strong>Booked By:</strong> {booking.username}</p>

      <div className="my-4">
        <h5>Your Ticket QR Code:</h5>
        <img src={qrCode} alt="QR Code" width="250" />
      </div>

      <div className="mt-4">
        <a href={pdfUrl} className="btn btn-primary" download>
          Download Ticket PDF
        </a>
      </div>
    </div>
  );
};

export default BookingSuccess;
