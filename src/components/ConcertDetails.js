import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ConcertDetails() {
  const { concertId } = useParams();
  const [concert, setConcert] = useState(null);

  useEffect(() => {
    const fetchConcert = async () => {
      try {
        const response = await axios.get(`/api/concert/${concertId}`);
        setConcert(response.data);
      } catch (error) {
        console.error('Error fetching concert:', error);
      }
    };

    if (concertId) {
      fetchConcert();
    }
  }, [concertId]);

  if (!concert) return <p>Loading concert details...</p>;

  return (
    <div>
      <h2>{concert.concertName}</h2>
      <p>Date & Time: {new Date(concert.dateTime).toLocaleString()}</p>
      <p>Venue: {concert.venue}</p>
      <p>Price: ₹{concert.ticketPrice}</p>
      <p>Available Tickets: {concert.availableTickets}</p>
      <img src={concert.image} alt={concert.concertName} width="300" />
    </div>
  );
}

export default ConcertDetails;
