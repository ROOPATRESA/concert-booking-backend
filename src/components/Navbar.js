import React  from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let isAuthenticated = false;
  let isAdmin = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      isAuthenticated = true;
      isAdmin = decoded.role === "admin";
    } catch (err) {
      console.error("Invalid token");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const activeClass = "nav-link active text-warning fw-bold";
  const inactiveClass = "nav-link";

  // State to toggle dropdown visibility (optional, if you want to control dropdown manually)
  // Bootstrap handles dropdown toggle automatically so not mandatory here

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <NavLink className="navbar-brand fw-bold text-warning" to="/">
        🎵 ConcertBook
      </NavLink>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          {/* Common links visible to everyone */}
          <li className="nav-item">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? activeClass : inactiveClass
              }
            >
              Home
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/concerts"
              className={({ isActive }) =>
                isActive ? activeClass : inactiveClass
              }
            >
              Concerts
            </NavLink>
          </li>

          {/* Links visible only if authenticated */}
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <li className="nav-item dropdown">
                  <span
                    className="nav-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ cursor: "pointer" }}
                  >
                    Admin Panel
                  </span>
                  <ul className="dropdown-menu dropdown-menu-dark">
                    <li>
                      <NavLink
                        to="/concerts/create"
                        className={({ isActive }) =>
                          isActive ? "dropdown-item active" : "dropdown-item"
                        }
                      >
                        Create Concert
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/concertpage"
                        className={({ isActive }) =>
                          isActive ? "dropdown-item active" : "dropdown-item"
                        }
                      >
                        Update Concert List
                      </NavLink>
                    </li>
                    {/* <li>
                      <NavLink
                        to="/admin/registered-users"
                        className={({ isActive }) =>
                          isActive ? "dropdown-item active" : "dropdown-item"
                        }
                      >
                        Registered Users
                      </NavLink>
                    </li> */}
                  </ul>
                </li>
              )}
              <li className="nav-item">
  <NavLink
    to="/my-bookings"
    className={({ isActive }) =>
      isActive ? activeClass : inactiveClass
    }
  >
    My Bookings
  </NavLink>
</li>


              <li className="nav-item">
                <button
                  className="btn btn-outline-warning ms-3"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            /* Links visible only if NOT authenticated */
            <>
              <li className="nav-item">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? activeClass : inactiveClass
                  }
                >
                  Login
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive ? activeClass : inactiveClass
                  }
                >
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
