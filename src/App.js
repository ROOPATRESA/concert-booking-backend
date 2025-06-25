import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
// import AdminDashboard from "./pages/AdminDashboard";
import CreateConcert from "./components/crud/CreateConcert";
import ConcertsPage from "./components/crud/ConcertsPage";
import UpdateConcert from "./components/crud/UpdateConcert";
import ConcertBookingPage from "./pages/ConcertBookingPage";
import ConcertDetails from "./components/ConcertDetails";
import ConcertList from "./pages/ConcertList";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import MyBookings from "./pages/MyBookings"; 

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}
         <Route path="/concertpage" element={<ConcertsPage />} />
         <Route path="/concerts/create" element={<CreateConcert />} />
         <Route path="/update-concert/:id" element={<UpdateConcert />} />
         <Route path="/concertbookingpage/:concertId" element={<ConcertBookingPage/>} />
         <Route path="/concert/:concertId" element={<ConcertDetails />} />
         <Route path="/concerts" element={<ConcertList />} />
         <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
         <Route path="/my-bookings" element={<MyBookings />} />
        


      </Routes>
    </>
  );
}

export default App;
