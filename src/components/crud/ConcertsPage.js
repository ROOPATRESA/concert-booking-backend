import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ConcertList = () => {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchConcerts();
  }, []);

  const fetchConcerts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/retrieve_concert_api');
      setConcerts(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load concerts');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!token) {
      alert('You must be logged in as admin to delete a concert.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this concert?')) return;

    try {
      await axios.delete(`http://localhost:3000/api/delete_concert_api/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Concert deleted successfully');
      fetchConcerts();
    } catch (error) {
      alert('Failed to delete concert');
    }
  };

  if (loading) return <p style={{ color: '#fff', padding: '20px' }}>Loading concerts...</p>;
  if (error) return <p style={{ color: 'red', padding: '20px' }}>{error}</p>;

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '50px 20px',
        backgroundColor: 'rgba(0,0,0,0.95)',
        backgroundImage: `
          radial-gradient(circle at 25% 35%, rgba(255, 223, 0, 0.6), transparent 100%),
          radial-gradient(circle at 75% 30%, rgba(255, 200, 0, 0.6), transparent 90%),
          radial-gradient(circle at 50% 80%, rgba(255, 240, 100, 0.5), transparent 80%)
        `,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
      }}
    >
      <h1 style={{ color: '#ffeb3b', textShadow: '0 0 12px #ffeb3b', fontWeight: 'bold' }}>
        🎵 Concert List
      </h1>

      {concerts.length === 0 ? (
        <p style={{ color: '#ccc', fontWeight: 'bold' }}>No concerts available.</p>
      ) : (
        <table
          className="table table-bordered table-hover text-white"
          style={{
            width: '100%',
            maxWidth: '1100px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '14px',
            boxShadow: '0 0 25px 6px rgba(255, 235, 59, 0.4)',
            overflow: 'hidden',
            borderCollapse: 'collapse',
            textAlign: 'center',
          }}
        >
          <thead
            style={{
              backgroundColor: 'rgba(255, 235, 59, 0.8)',
              color: '#000',
              fontWeight: 'bold',
            }}
          >
            <tr>
              <th>Name</th>
              <th>Date & Time</th>
              <th>Venue</th>
              <th>Price</th>
              <th>Tickets</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {concerts.map((concert) => (
              <tr key={concert.id}>
                <td>{concert.concertName}</td>
                <td>{new Date(concert.dateTime).toLocaleString()}</td>
                <td>{concert.venue}</td>
                <td>₹{concert.ticketPrice}</td>
                <td>{concert.availableTickets}</td>
                <td>
                  {concert.image && (
                    <img
                      src={concert.image}
                      alt={concert.concertName}
                      style={{
                        width: '80px',
                        borderRadius: '6px',
                        objectFit: 'cover',
                        boxShadow: '0 0 8px rgba(255, 255, 255, 0.4)',
                      }}
                    />
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => navigate(`/update-concert/${concert.id}`)}
                    style={{
                      fontWeight: 'bold',
                      borderRadius: '20px',
                      padding: '4px 12px',
                      boxShadow: '0 0 6px #ffeb3b',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(concert.id)}
                    style={{
                      fontWeight: 'bold',
                      borderRadius: '20px',
                      padding: '4px 12px',
                      boxShadow: '0 0 6px red',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ConcertList;
