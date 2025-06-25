import React from 'react';

const DownloadTicketButton = ({ bookingId }) => {
  const downloadUrl = `http://localhost:3000/api/download-ticket/${bookingId}`;
  console.log("Booking ID in frontend:", bookingId);

  const handleDownload = () => {
    window.open(downloadUrl, '_blank');
  };

  return (
    <button 
      onClick={handleDownload} 
      className="yellow-bulb-btn"
      style={{
        backgroundColor: '#ffeb3b',
        color: '#000',
        border: 'none',
        padding: '10px 20px',
        fontWeight: 'bold',
        borderRadius: '30px',
        boxShadow: '0 0 15px 5px rgba(255, 235, 59, 0.8)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = '#fff176';
        e.currentTarget.style.boxShadow = '0 0 25px 10px rgba(255, 235, 59, 1)';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = '#ffeb3b';
        e.currentTarget.style.boxShadow = '0 0 15px 5px rgba(255, 235, 59, 0.8)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
       Download Ticket PDF
    </button>
  );
};

export default DownloadTicketButton;
