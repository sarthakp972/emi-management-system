import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext'; // Import AuthContext
import { signOut } from 'firebase/auth'; // Firebase sign out method
import { auth } from '../FirebaseConfig'; // Your Firebase config

const Navbar = () => {
  const { currentUser } = useContext(AuthContext); // Access currentUser from AuthContext
  const navigate = useNavigate(); // To handle redirection programmatically

  const handleAdminClick = () => {
    if (currentUser) {
      // If the user is logged in, redirect to the admin page
      navigate('/admin');
    } else {
      // If the user is not logged in, redirect to the login page
      navigate('/login');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Firebase sign out
      navigate('/login'); // Redirect to login page after signing out
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          🏦 Pahal Loan
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <Link className="nav-link" to="/">Customer EMI Details</Link>
            <span className="nav-link" onClick={handleAdminClick} style={{ cursor: 'pointer' }}>
              ADMIN
            </span>
            <Link className="nav-link" to="/emi-history">EMI Collection History</Link>

            {currentUser ? (
              // If the user is logged in, show "Sign Out"
              <span className="nav-link" onClick={handleSignOut} style={{ cursor: 'pointer' }}>
                Sign Out
              </span>
            ) : (
              // If the user is not logged in, show nothing or keep the existing links
              <Link className="nav-link" to="/login">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
