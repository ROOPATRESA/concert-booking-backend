import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ConcertList = () => {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/retrieve_concert_api");
        setConcerts(res.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load concerts");
        setLoading(false);
      }
    };

    fetchConcerts();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5 fs-4 text-warning">
        Loading concerts...
      </div>
    );
  if (error) return <div className="alert alert-danger mt-3">{error}</div>;

  return (
    <div
      className="min-vh-100 py-5"
      style={{
        background: `
          radial-gradient(circle at 25% 35%, rgba(255, 223, 0, 0.6), transparent 100%),
          radial-gradient(circle at 75% 30%, rgba(255, 200, 0, 0.6), transparent 90%),
          radial-gradient(circle at 50% 80%, rgba(255, 240, 100, 0.5), transparent 80%)
        `,
        backgroundColor: "#000", // base black
        backgroundBlendMode: "screen",
        paddingBottom: "60px",
      }}
    >
      <div className="container">
        <h2 className="text-center mb-5 fw-bold text-light text-uppercase">
          Available Concerts
        </h2>
        <div className="row g-4">
          {concerts.map((concert) => (
            <div key={concert.id} className="col-md-6 col-lg-4">
              <div
                className="card h-100 text-light"
                style={{
                  borderRadius: "20px",
                  backgroundColor: "rgba(0, 0, 0, 0.7)", // Transparent black
                  boxShadow:
                    "0 0 25px 5px rgba(255, 255, 0, 0.8), inset 0 0 10px 2px rgba(255, 255, 0, 0.3)", // Yellow glow bulb
                  transition: "transform 0.3s ease",
                }}
              >
                <img
                  src={concert.image}
                  className="card-img-top"
                  alt={concert.concertName}
                  style={{
                    height: "220px",
                    objectFit: "cover",
                    borderTopLeftRadius: "20px",
                    borderTopRightRadius: "20px",
                  }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">{concert.concertName}</h5>
                  <p className="card-text">
                    <strong>Date & Time:</strong>{" "}
                    {new Date(concert.dateTime).toLocaleString()}
                  </p>
                  <p className="card-text">
                    <strong>Venue:</strong> {concert.venue}
                  </p>
                  <p className="card-text">
                    <strong>Price:</strong> ${concert.ticketPrice}
                  </p>
                  <p className="card-text">
                    <strong>Tickets Left:</strong> {concert.availableTickets}
                  </p>

                  <Link
                    to={`/concertbookingpage/${concert.id}`}
                    className="btn btn-warning mt-auto fw-bold rounded-pill shadow"
                    style={{
                      boxShadow: "0 0 10px 3px rgba(255, 235, 59, 0.8)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 0 20px 6px rgba(255, 235, 59, 1)";
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 0 10px 3px rgba(255, 235, 59, 0.8)";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    Book Tickets
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConcertList;
