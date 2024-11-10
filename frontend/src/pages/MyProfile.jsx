// MyProfile.js
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, Typography, Avatar } from '@mui/material';

const MyProfile = () => {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return <Typography variant="h6">Please log in to view your profile</Typography>;
  }

  return (
    <Box 
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={3}
      sx={{ maxWidth: '600px', margin: 'auto', backgroundColor: '#f9f9f9', borderRadius: '8px',
        marginTop:'180px'
       }}
    >
      <Avatar
        src={user.picture}
        alt="User Profile"
        sx={{ width: 100, height: 100, marginBottom: 2, border: '2px solid #298282' }}
      />
      <Typography variant="h4" color="primary" gutterBottom>
        {user.name || "User Name"}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Email: {user.email || "user@example.com"}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Username: {user.nickname || "Username"}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        This is your personal profile page.
      </Typography>
    </Box>
  );
};

export default MyProfile;
