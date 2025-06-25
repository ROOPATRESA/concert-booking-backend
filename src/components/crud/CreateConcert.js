import axios from 'axios';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateConcert() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [concertName, setConcertName] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [venue, setVenue] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [availableTickets, setAvailableTickets] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage('You are not logged in.');
      return;
    }

    if (!imageFile) {
      setMessage('Please select an image file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('concertName', concertName);
      formData.append('dateTime', dateTime);
      formData.append('venue', venue);
      formData.append('ticketPrice', ticketPrice);
      formData.append('availableTickets', availableTickets);
      formData.append('image', imageFile);

      await axios.post('http://localhost:3000/api/create_concert_api', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('Concert created successfully!');

      // Clear form fields
      setConcertName('');
      setDateTime('');
      setVenue('');
      setTicketPrice('');
      setAvailableTickets('');
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      // Navigate to concert list
      navigate('/concertpage');
    } catch (error) {
      console.log("Full error:", error.response?.data);
      setMessage('Error creating concert: ' + (error.response?.data?.error || error.message));
    }
  };

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
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <div
        className="container mt-5 p-4"
        style={{
          maxWidth: '600px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '20px',
          boxShadow: '0 0 20px 4px rgba(255, 235, 59, 0.7)', // subtle yellow glow around card
          color: '#fff',
        }}
      >
        <h2 className="mb-4 text-center fw-bold text-warning text-uppercase">
          Create New Concert
        </h2>
        {message && (
          <div
            className={`alert ${
              message.includes('Error') ? 'alert-danger' : 'alert-warning'
            }`}
            role="alert"
            style={{ fontWeight: '600' }}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              htmlFor="concertName"
              className="form-label text-warning fw-semibold"
            >
              Concert Name
            </label>
            <input
              type="text"
              className="form-control"
              id="concertName"
              value={concertName}
              onChange={(e) => setConcertName(e.target.value)}
              required
              style={{
                backgroundColor: 'rgba(255, 255, 224, 0.1)',
                color: '#fff',
                borderColor: 'rgba(255, 255, 0, 0.8)',
                boxShadow: '0 0 8px rgba(255, 255, 0, 0.7)',
                borderRadius: '8px',
              }}
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="dateTime"
              className="form-label text-warning fw-semibold"
            >
              Date and Time
            </label>
            <input
              type="datetime-local"
              className="form-control"
              id="dateTime"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
              style={{
                backgroundColor: 'rgba(255, 255, 224, 0.1)',
                color: '#fff',
                borderColor: 'rgba(255, 255, 0, 0.8)',
                boxShadow: '0 0 8px rgba(255, 255, 0, 0.7)',
                borderRadius: '8px',
              }}
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="venue"
              className="form-label text-warning fw-semibold"
            >
              Venue
            </label>
            <input
              type="text"
              className="form-control"
              id="venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
              style={{
                backgroundColor: 'rgba(255, 255, 224, 0.1)',
                color: '#fff',
                borderColor: 'rgba(255, 255, 0, 0.8)',
                boxShadow: '0 0 8px rgba(255, 255, 0, 0.7)',
                borderRadius: '8px',
              }}
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="ticketPrice"
              className="form-label text-warning fw-semibold"
            >
              Ticket Price
            </label>
            <input
              type="number"
              className="form-control"
              id="ticketPrice"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              required
              style={{
                backgroundColor: 'rgba(255, 255, 224, 0.1)',
                color: '#fff',
                borderColor: 'rgba(255, 255, 0, 0.8)',
                boxShadow: '0 0 8px rgba(255, 255, 0, 0.7)',
                borderRadius: '8px',
              }}
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="availableTickets"
              className="form-label text-warning fw-semibold"
            >
              Available Tickets
            </label>
            <input
              type="number"
              className="form-control"
              id="availableTickets"
              value={availableTickets}
              onChange={(e) => setAvailableTickets(e.target.value)}
              required
              style={{
                backgroundColor: 'rgba(255, 255, 224, 0.1)',
                color: '#fff',
                borderColor: 'rgba(255, 255, 0, 0.8)',
                boxShadow: '0 0 8px rgba(255, 255, 0, 0.7)',
                borderRadius: '8px',
              }}
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="imageFile"
              className="form-label text-warning fw-semibold"
            >
              Concert Image
            </label>
            <input
              type="file"
              className="form-control"
              id="imageFile"
              ref={fileInputRef}
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              required
              style={{
                backgroundColor: 'rgba(255, 255, 224, 0.1)',
                color: '#fff',
                borderColor: 'rgba(255, 255, 0, 0.8)',
                boxShadow: '0 0 8px rgba(255, 255, 0, 0.7)',
                borderRadius: '8px',
              }}
            />
          </div>
          <button
            type="submit"
            className="btn w-100 fw-bold text-dark"
            style={{
              backgroundColor: '#ffeb3b',
              boxShadow: '0 0 20px 5px rgba(255, 235, 59, 0.9)',
              borderRadius: '50px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 35px 8px rgba(255, 235, 59, 1)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px 5px rgba(255, 235, 59, 0.9)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Create Concert
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateConcert;
