import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ConcertBookingPage = () => {
  const navigate = useNavigate();
  const { concertId } = useParams();
  const token = localStorage.getItem("token");

  const [concert, setConcert] = useState(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tickets, setTickets] = useState(1);

  useEffect(() => {
    const fetchUserAndConcert = async () => {
      if (!concertId || !token) {
        setError("No concert selected or user not logged in");
        setLoading(false);
        return;
      }

      try {
        const userRes = await axios.get("http://localhost:3000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = userRes.data.user || {};
        setUserName(user.name || user.email || "User");

        const concertRes = await axios.get(
          `http://localhost:3000/api/concert/${concertId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setConcert(concertRes.data);
      } catch (err) {
        console.error("Fetch error:", err.response || err.message);
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndConcert();
  }, [concertId, token]);

  const handleBooking = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/book_concert",
        { concertId, tickets },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const bookingData = res.data.booking;
      const qrCodeUrl = res.data.qrCode;

      if (!bookingData) {
        alert("Booking failed: Empty response");
        return;
      }

      alert("Booking successful!");

      setConcert(prev => ({
        ...prev,
        availableTickets: prev.availableTickets - tickets,
      }));

      const pdfUrl = `http://localhost:3000/tickets/ticket_${bookingData._id}.pdf`;

      navigate("/booking-confirmation", {
        state: {
          bookingId: bookingData._id,
          concertName: concert?.concertName,
          dateTime: concert?.dateTime,
          venue: concert?.venue,
          bookedBy: userName,
          ticketsBooked: tickets,
          qrCodeUrl,
          pdfUrl,
        },
      });

    } catch (err) {
      console.error("Booking error:", err.response || err.message);
      alert("Booking failed: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="text-center mt-4 fs-4 text-warning">Loading concert details...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: `
          radial-gradient(circle at 25% 35%, rgba(255, 223, 0, 0.6), transparent 100%),
          radial-gradient(circle at 75% 30%, rgba(255, 200, 0, 0.6), transparent 90%),
          radial-gradient(circle at 50% 80%, rgba(255, 240, 100, 0.5), transparent 80%)
        `,
        backgroundColor: "#000",
        backgroundBlendMode: "screen",
        padding: "50px 20px",
      }}
    >
     <div
  className="card shadow-lg p-4 text-white"
  style={{
    maxWidth: "600px",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // 🔥 transparent black
    borderRadius: "20px",
    boxShadow: "0 0 25px 5px rgba(255, 255, 0, 0.7)", // yellow glow
    backdropFilter: "blur(3px)", // optional smooth glass effect
  }}
>

      
        <h4 className="text-success mb-3">🎉 Welcome, {userName}</h4>
        <h2 className="mb-3">Book Tickets for <span className="text-primary">{concert?.concertName}</span></h2>

        <p><strong>Date & Time:</strong> {new Date(concert.dateTime).toLocaleString()}</p>
        <p><strong>Venue:</strong> {concert.venue}</p>
        <p><strong>Price per Ticket:</strong> ₹{concert.ticketPrice}</p>
        <p><strong>Available Tickets:</strong> {concert.availableTickets}</p>

        <div className="mb-3">
          <label htmlFor="tickets" className="form-label fw-semibold">Select number of tickets (max 3)</label>
          <input
            type="number"
            id="tickets"
            className="form-control"
            min={1}
            max={Math.min(3, concert.availableTickets)}
            value={tickets}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value >= 1 && value <= 3 && value <= concert.availableTickets) {
                setTickets(value);
              }
            }}
          />
        </div>

        <button
          className="btn btn-warning fw-bold"
          onClick={handleBooking}
          disabled={tickets > concert.availableTickets}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default ConcertBookingPage;
