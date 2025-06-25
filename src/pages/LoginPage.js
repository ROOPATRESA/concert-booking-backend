import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    setMessage("All fields are required!");
    return;
  }

  try {
    const response = await axios.post("http://localhost:3000/api/login_api", { email, password });
    console.log("Login response:", response.data); // <-- Check what is received here

    const { token } = response.data;
    

    if (token) {
      localStorage.setItem("token", token);
       localStorage.setItem("token", response.data.token);
       
      setMessage("✅ Login successful!");
      setEmail("");
      setPassword("");
      navigate("/concerts");
    } else {
      setMessage("❌ No token received from server");
    }
  } catch (err) {
    setMessage(err.response?.data?.message || "❌ Login failed");
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
            radial-gradient(circle at 75% 30%, rgba(255, 200, 0, 0.6), transparent 90%),
            radial-gradient(circle at 50% 80%, rgba(255, 240, 100, 0.5), transparent 80%)
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

      >
        <h3 className="text-center mb-4 text-warning fw-bold" style={{ letterSpacing: "1.5px" }}>
          Login to Continue
        </h3>

        {message && (
          <div className="alert text-center fw-semibold p-2" style={{ color: message.includes("✅") ? "green" : "red" }}>
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} noValidate>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              className="form-control form-control-lg"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                borderRadius: "12px",
                border: "2px solid #ffd700",
                boxShadow: "inset 2px 2px 8px rgba(255, 223, 0, 0.2)",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.boxShadow = "0 0 12px 2px #ffd700")}
              onBlur={(e) => (e.target.style.boxShadow = "inset 2px 2px 8px rgba(255, 223, 0, 0.2)")}
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              name="password"
              className="form-control form-control-lg"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                borderRadius: "12px",
                border: "2px solid #ffd700",
                boxShadow: "inset 2px 2px 8px rgba(255, 223, 0, 0.2)",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.boxShadow = "0 0 12px 2px #ffd700")}
              onBlur={(e) => (e.target.style.boxShadow = "inset 2px 2px 8px rgba(255, 223, 0, 0.2)")}
            />
          </div>

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
            Login
          </button>
        </form>
     <p className="mt-4 text-center" style={{ color: "white" }}>
  Don’t have an account?{" "}
  <a
    href="/register"
    className="text-decoration-none fw-semibold"
    style={{ color: "white" }}
  >
    Register here
  </a>
</p>

      </div>
    </div>
  );
}

export default LoginPage;
