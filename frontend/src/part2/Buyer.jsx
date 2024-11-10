import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, Container, Snackbar, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Change here: useNavigate instead of useHistory

function BuyerForm() {
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerPhone: '',
    buyerEmail: '',
    buyerAddress: '',
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const [openDialog, setOpenDialog] = useState(false); // To control the dialog visibility

  const navigate = useNavigate(); // Change here: useNavigate hook

  // Simulating an existing buyers list for validation (this can be an API call in real-world applications)
  const existingBuyers = [
    { email: 'existingbuyer@example.com' },
    { email: 'john.doe@example.com' },
  ];

  // Check if buyer already exists based on email
  const checkIfBuyerExists = (email) => {
    return existingBuyers.some((buyer) => buyer.email === email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the buyer already exists
    if (checkIfBuyerExists(formData.buyerEmail)) {
      setSnackbarMessage('User already exists!');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } else {
      console.log('Buyer Registration Data:', formData);
      // Add logic to handle registration (e.g., send to backend)

      // Show success message and open the dialog
      setSnackbarMessage('Registration successful!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setOpenDialog(true); // Open the success dialog
    }
  };

  const handleDialogClose = (action) => {
    setOpenDialog(false);

    // If the buyer chooses to go to the product list, redirect them
    if (action === 'buyFinal') {
      navigate('/pat2/Final'); // Change here: use navigate() to redirect
    } 
    else if (action === 'goHome') {
      navigate('/'); // Change here: use navigate() to go home
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 8 }}>
      <Card>
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <Typography variant="h5" textAlign="center" gutterBottom>
              Buyer Registration
            </Typography>

            <TextField
              label="Name"
              name="buyerName"
              value={formData.buyerName}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Phone Number"
              name="buyerPhone"
              type="tel"
              value={formData.buyerPhone}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Email"
              name="buyerEmail"
              type="email"
              value={formData.buyerEmail}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Address"
              name="buyerAddress"
              value={formData.buyerAddress}
              onChange={handleChange}
              fullWidth
              required
              multiline
              rows={3}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ mt: 2 }}
            >
              Register
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Snackbar for showing feedback messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Dialog for showing success message and options */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Registration Successful!</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            You have successfully registered! Would you like to:
          </Typography>
        </DialogContent>
        <DialogActions>

          
         <Button onClick={() => handleDialogClose('goHome')} color="secondary">
            Go to Home Page
          </Button>
          <Button onClick={() => handleDialogClose('buyFinal')} color="primary">
            Continue To Buy
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default BuyerForm;