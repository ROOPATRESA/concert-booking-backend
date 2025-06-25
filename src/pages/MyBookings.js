import React, { useEffect, useState } from 'react';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch('http://localhost:3000/api/my_bookings', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [token]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const res = await fetch(`http://localhost:3000/api/cancel-booking/${bookingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to cancel booking');
      }

      setBookings(bookings.filter((b) => b.bookingId !== bookingId));
      alert('Booking canceled successfully.');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <p style={{ color: 'white', textAlign: 'center' }}>Loading your bookings...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>;
  if (bookings.length === 0) return <p style={{ color: 'white', textAlign: 'center' }}>No bookings found.</p>;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `radial-gradient(circle at center, #ffd600 0%, rgb(94, 81, 23) 70%)`,
        padding: '40px 20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h2 style={{ color: '#ffeb3b', textShadow: '0 0 10px #ffeb3b', marginBottom: '30px' }}>My Bookings</h2>

      <div
        style={{
          width: '100%',
          maxWidth: '1000px',
          overflowX: 'auto',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderRadius: '12px',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.8)',
        }}
      >
        <table className="table text-white mb-0" style={{ textAlign: 'center', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: 'rgba(255, 235, 59, 0.9)', color: '#000' }}>
            <tr>
              <th>Concert</th>
              <th>Date & Time</th>
              <th>Venue</th>
              <th>Tickets Booked</th>
              <th>Download Ticket</th>
              <th>Cancel Booking</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking.bookingId}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <td>{booking.concertName}</td>
                <td>{new Date(booking.dateTime).toLocaleString()}</td>
                <td>{booking.venue}</td>
                <td>{booking.ticketsBooked}</td>
                <td>
                  <a
                    href={`http://localhost:3000/api/download-ticket/${booking.bookingId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-dark btn-sm"
                    style={{
                      backgroundColor: '#000',
                      color: '#ffd600',
                      fontWeight: '600',
                      border: '1px solid #ffd600',
                    }}
                  >
                    Download PDF
                  </a>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleCancel(booking.bookingId)}
                    style={{ fontWeight: '600' }}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyBookings;
