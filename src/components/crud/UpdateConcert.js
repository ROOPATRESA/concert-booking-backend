import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateConcert() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [concertName, setConcertName] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [venue, setVenue] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [availableTickets, setAvailableTickets] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchConcert() {
      try {
        const response = await axios.get(`http://localhost:3000/api/concert/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const concert = response.data;
        setConcertName(concert.concertName);
        setDateTime(concert.dateTime.slice(0, 16));
        setVenue(concert.venue);
        setTicketPrice(concert.ticketPrice);
        setAvailableTickets(concert.availableTickets);
        setExistingImage(concert.image);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load concert:', error.response?.data || error.message);
        setMessage('Failed to load concert data.');
        setLoading(false);
      }
    }

    fetchConcert();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage('You must be logged in to update a concert.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('concertName', concertName);
      formData.append('dateTime', dateTime);
      formData.append('venue', venue);
      formData.append('ticketPrice', ticketPrice);
      formData.append('availableTickets', availableTickets);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await axios.put(`http://localhost:3000/api/update_concert_api/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('Concert updated successfully!');
      navigate('/concertpage');
    } catch (error) {
      console.error('Update error:', error.response?.data || error.message);
      setMessage('Error updating concert: ' + (error.response?.data?.error || error.message));
    }
  };

  if (loading) return <p style={{ color: '#ffeb3b', textAlign: 'center', marginTop: '50px' }}>Loading concert details...</p>;

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '40px 20px',
        background: 'radial-gradient(circle, #ffeb3b 0%, #000000 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '30px',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '600px',
          boxShadow: '0 8px 20px rgba(255, 235, 59, 0.8)', // yellow glow
        }}
      >
        <h2 style={{ color: '#ffeb3b', textAlign: 'center', marginBottom: '20px' }}>Update Concert</h2>
        {message && (
          <div
            className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}
            role="alert"
            style={{ color: message.includes('Error') ? '#ff5252' : '#cddc39', backgroundColor: 'transparent', border: 'none' }}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="concertName" className="form-label text-white">Concert Name</label>
            <input
              type="text"
              className="form-control"
              id="concertName"
              value={concertName}
              onChange={(e) => setConcertName(e.target.value)}
              required
              style={{ backgroundColor: '#222', color: '#ffeb3b', borderColor: '#ffeb3b' }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="dateTime" className="form-label text-white">Date and Time</label>
            <input
              type="datetime-local"
              className="form-control"
              id="dateTime"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
              style={{ backgroundColor: '#222', color: '#ffeb3b', borderColor: '#ffeb3b' }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="venue" className="form-label text-white">Venue</label>
            <input
              type="text"
              className="form-control"
              id="venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
              style={{ backgroundColor: '#222', color: '#ffeb3b', borderColor: '#ffeb3b' }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="ticketPrice" className="form-label text-white">Ticket Price</label>
            <input
              type="number"
              className="form-control"
              id="ticketPrice"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              required
              style={{ backgroundColor: '#222', color: '#ffeb3b', borderColor: '#ffeb3b' }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="availableTickets" className="form-label text-white">Available Tickets</label>
            <input
              type="number"
              className="form-control"
              id="availableTickets"
              value={availableTickets}
              onChange={(e) => setAvailableTickets(e.target.value)}
              required
              style={{ backgroundColor: '#222', color: '#ffeb3b', borderColor: '#ffeb3b' }}
            />
          </div>
          <div className="mb-3 text-white">
            <label className="form-label">Existing Image</label><br />
            {existingImage ? (
              <img src={existingImage} alt="Concert" style={{ maxWidth: '300px', borderRadius: 5 }} />
            ) : (
              <p>No image uploaded</p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="imageFile" className="form-label text-white">Change Concert Image (optional)</label>
            <input
              type="file"
              className="form-control"
              id="imageFile"
              ref={fileInputRef}
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              style={{ backgroundColor: '#222', color: '#ffeb3b', borderColor: '#ffeb3b' }}
            />
          </div>
          <button type="submit" className="btn btn-warning w-100">Update Concert</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateConcert;
