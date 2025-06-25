import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        position: 'relative',
        background: `
          radial-gradient(circle at center, #ffd600 0%,rgb(94, 81, 23) 70%)
        `,
        
        overflow: 'hidden',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#000',
      }}
    >
      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          flexDirection: 'column',
          padding: '0 20px',
          display: 'flex',
          
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        <h1 style={{ fontWeight: '700', fontSize: '3.5rem', marginBottom: '1rem' }}>
          Book Your Favorite Concerts Instantly 🎤
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem', maxWidth: '600px' }}>
          Enjoy live music. Reserve your seat now!
        </p>

        <Link
          to="/register"
          style={{
            backgroundColor: '#000', // black background
            color: '#ffd600', // yellow text matching background accent
            padding: '15px 40px',
            fontSize: '1.25rem',
            fontWeight: '600',
            borderRadius: '50px',
            boxShadow: '0 0 20px 5px #fdd835', // subtle glow
            textDecoration: 'none',
            transition: 'box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 0 30px 10px #fbc02d';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = '0 0 20px 5px #fdd835';
          }}
        >
          Join Us
        </Link>
      </div>
    </div>
  );
};

export default Home;
