import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useIsLoggedIn } from "../utils/hooks";
import { signout } from "../utils/api";
import "../styles/NavBar.css";

function NavBar() {
    const isLoggedIn = useIsLoggedIn();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setDropdownOpen(prev => !prev);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          setDropdownOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <header>
        {/* Main Section */}
        <div className="main-section">
          <div className="container2">
            <Link to="/" className="header-left">
              <img src="../../images/RepMaxWhiteArmLogo.png" className="logo" />
              <div className="header-title">
                RepMax
              </div>
            </Link>

            <div className="header-right">
              <div className="login-container">
                {/* DROPDOWN BUTTON */}
                <div className="dropdown" ref={dropdownRef}>
                  <button 
                    className={`hamburger ${dropdownOpen ? "open" : ""}`}
                    onClick={toggleDropdown}
                    aria-label="Menu"
                  >
                    <span className="bar top-bar"></span>
                    <span className="bar middle-bar"></span>
                    <span className="bar bottom-bar"></span>
                  </button>
                  {dropdownOpen && (
                    <div className="dropdown-menu">
                      <Link to="/" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Calculator</Link>
                      {isLoggedIn ? (
                        <>
                          <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Profile</Link>
                          <Link to="/" className="dropdown-item" onClick={() => {
                            const confirmed = window.confirm("Are you sure you want to sign out?"); 
                            if (!confirmed) return; 
                            signout(); 
                            setDropdownOpen(false);
                            }}>Logout</Link>
                        </>
                        ) : (
                        <>
                          <Link to="/login" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Login</Link>
                        </>
                      )}
                      <Link to="/leaderboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Leaderboard</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
}

export default function Layout() {
    return (
      <div className="app-container">
        <NavBar />
      </div>
    );
}