import React from "react";
import { useLocation } from "react-router-dom";
import DownloadTicketButton from "../components/DownloadTicketButton";

const BookingConfirmationPage = () => {
  const location = useLocation();

  if (!location.state) {
    return <p className="text-danger text-center mt-5">No booking data found. Please book a ticket first.</p>;
  }

  const {
    bookingId,
    concertName,
    dateTime,
    venue,
    bookedBy,
    ticketsBooked,
    qrCodeUrl,
  } = location.state || {};

  const formattedDateTime = new Date(dateTime).toLocaleString();

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: `
          radial-gradient(circle at 25% 35%, rgba(255, 223, 0, 0.6), transparent 100%),
          radial-gradient(circle at 75% 30%, rgba(255, 200, 0, 0.6), transparent 90%),
          radial-gradient(circle at 50% 80%, rgba(255, 240, 100, 0.5), transparent 80%)`,
        backgroundColor: "#000",
        backgroundBlendMode: "screen",
        padding: "2rem",
      }}
    >
      <div
        className="card shadow-lg p-4 text-white text-center"
        style={{
          maxWidth: "600px",
          width: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderRadius: "20px",
          boxShadow: "0 0 25px 5px rgba(255, 255, 0, 0.7)",
          backdropFilter: "blur(4px)",
        }}
      >
        <h1 className="mb-4 text-warning"> Booking Confirmed!</h1>

        <p><strong>Concert:</strong> {concertName || "N/A"}</p>
        <p><strong>Date & Time:</strong> {formattedDateTime || "N/A"}</p>
        <p><strong>Venue:</strong> {venue || "N/A"}</p>
        <p><strong>Booked By:</strong> {bookedBy || "N/A"}</p>
        <p><strong>Tickets Booked:</strong> {ticketsBooked || "N/A"}</p>

        {qrCodeUrl && (
          <div className="my-4">
            <p><strong>Scan your QR Ticket:</strong></p>
            <img
              src={qrCodeUrl}
              alt="QR Code"
              width="200"
              className="img-fluid border border-warning rounded"
              style={{ backgroundColor: "white", padding: "10px" }}
            />
          </div>
        )}

        {bookingId ? (
          <DownloadTicketButton bookingId={bookingId} />
        ) : (
          <p className="text-danger">Booking ID not found. Cannot download ticket.</p>
        )}
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
