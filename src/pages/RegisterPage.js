import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password || !confirmPassword) {
      setMessage("All fields are required!");
      setMessageType("danger");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      setMessageType("danger");
      return;
    }

    try {
     
      await axios.post("http://localhost:3000/api/signup_api", { name, email, password, confirmPassword });
      console.log({ name, email, password, confirmPassword });
      setMessage("✅ Registration successful! Redirecting to login...");
      setMessageType("success");
      setForm({ name: "", email: "", password: "", confirmPassword: "" });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Registration failed");
      setMessageType("danger");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        position: "relative",
        backgroundColor: "#000",
        overflow: "hidden",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Yellow glowing bulbs background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(circle at 25% 35%, rgba(255, 223, 0, 0.6), transparent 100%),
            radial-gradient(circle at 75% 30%, rgba(255, 223, 0, 0.6), transparent 90%),
            radial-gradient(circle at 50% 80%, rgba(255, 200, 0, 0.5), transparent 80%)
          `,
          zIndex: 0,
          filter: "blur(100px)",
        }}
      />

     <div
  className="card p-5 shadow-lg"
  style={{
    maxWidth: "420px",
    width: "100%",
    borderRadius: "20px",
    backgroundColor: "rgba(0, 0, 0, 0.6)",  // black transparent
    backdropFilter: "blur(5px)",             // optional blur effect
    zIndex: 1,
    position: "relative",
    boxShadow: "0 8px 30px rgba(255, 223, 0, 0.4)",
  }}
      >
        <h3 className="text-center mb-4 text-warning fw-bold" style={{ letterSpacing: "1.5px" }}>
          Register
        </h3>

        {message && (
          <div className={`alert alert-${messageType} text-center`} role="alert" style={{ fontWeight: "600" }}>
            {message}
          </div>
        )}

        <form onSubmit={handleRegister} noValidate>
          {["name", "email", "password", "confirmPassword"].map((field, idx) => (
            <div className="mb-4" key={field}>
              <input
                type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
                name={field}
                className="form-control form-control-lg"
                placeholder={
                  field === "name"
                    ? "Full Name"
                    : field === "email"
                    ? "Email Address"
                    : field === "password"
                    ? "Create Password"
                    : "Confirm Password"
                }
                value={form[field]}
                onChange={handleChange}
                required
                style={{
                  borderRadius: "12px",
                  boxShadow: "inset 2px 2px 8px rgba(255, 223, 0, 0.2)",
                  border: "2px solid #ffd700",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.boxShadow = "0 0 12px 2px #ffd700")}
                onBlur={(e) => (e.target.style.boxShadow = "inset 2px 2px 8px rgba(255, 223, 0, 0.2)")}
              />
            </div>
          ))}

          <button
            type="submit"
            className="btn btn-warning w-100 fw-bold rounded-pill"
            style={{
              fontSize: "1.15rem",
              boxShadow: "0 6px 15px rgba(255, 223, 0, 0.6)",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
