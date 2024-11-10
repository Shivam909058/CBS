import { useAuth0 } from '@auth0/auth0-react';
import logo from "../assets/logo.png";
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Toolbar, Typography, Box, AppBar, Button, IconButton } from '@mui/material';
import { assets } from "../assets/assets.js";

function Appbar() {
  const navigate = useNavigate();
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to toggle the dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleProfileClick = () => {
    navigate('/MyProfile');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ backgroundColor: '#F5F5F5', color: 'black', py: 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <Box component={Link} to="/" sx={{ display: 'flex', justifyContent: "left", textDecoration: 'none' }}>
            <img src={logo} width={90} height={70} alt="logo" />
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 10}}>
            {["Home", "Contact", "Documentation"].map((item, index) => (
              <Link
                key={index}
                to={item === "Home" ? "/" : item === "Contact" ? "/contact" : "https://documentationofhomescrapper-s9ee3fpbijuazj6mq4pcq6.streamlit.app"}
                style={{
                  textDecoration: 'none',
                  color: 'black',
                  fontSize: '20px',
                  fontWeight: 500,
                  position: 'relative',
                }}
                onMouseEnter={(e) => (e.target.style.color = 'teal')}
                onMouseLeave={(e) => (e.target.style.color = 'black')}
              >
                {item}
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: '-2px',
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'teal',
                    transform: 'scaleX(0)',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = 'scaleX(1)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scaleX(0)')}
                />
              </Link>
            ))}
          </Box>

          {/* Profile & Auth Options */}
          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Profile Image & Dropdown */}
              <IconButton onClick={toggleDropdown} sx={{ p: 0 }}>
                <img
                  src={assets.profile_image}
                  alt="Profile"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    border: "2px solid black",
                    cursor: "pointer",
                  }}
                />
              </IconButton>

              {/* Dropdown */}
              {isDropdownOpen && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "70px",
                    right: "0px",
                    backgroundColor: "#FFF",
                    border: "1px solid #DDD",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    width: "150px",
                    zIndex: 1000,
                  }}
                >
                  <Box
                    onClick={handleProfileClick}
                    sx={{
                      padding: "10px",
                      cursor: "pointer",
                      borderBottom: "1px solid #DDD",
                      color: "black",
                      textAlign: "center"
                    }}
                  >
                    My Profile
                  </Box>
                  <Box
                    onClick={() => logout({ returnTo: window.location.origin })}
                    sx={{
                      padding: "10px",
                      cursor: "pointer",
                      color: "black",
                      textAlign: "center"
                    }}
                  >
                    Logout
                  </Box>
                </Box>
              )}
            </Box>
          ) : (
            <Button
              onClick={() => loginWithRedirect()}
              size="large"
              variant="contained"
              sx={{ backgroundColor: '#298282', color: '#FFF', fontWeight: 'bold', textTransform: 'none' }}
            >
              Sign-in
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {/* {!isAuthenticated && (
        <Box sx={{ textAlign: 'center', fontWeight: 900, mt: 16 }} >
          <Typography sx={{ fontSize: '20px', fontWeight: 700 }} >
            Sign-up to enjoy our Services
          </Typography>
        </Box>
      )} */}
    </Box>
  );
}

export default Appbar;