import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, Container, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import usePreviewImg from '../hooks/usePreviewImg';

function SellerOLXForm() {
  const [formData, setFormData] = useState({
    sellerName: '',
    sellerPhone: '',
    sellerEmail: '',
    sellerAddress: '',
    productName: '',  // New field for product name
    productDescription: '', 
  });

  const [openPopup, setOpenPopup] = useState(false);
  const navigate = useNavigate();
  const { handleImageChange, imgUrls, setImgUrls } = usePreviewImg();

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserData();
      if (userData) {
        setFormData({
          sellerName: userData.sellerName || '',
          sellerPhone: userData.sellerPhone || '',
          sellerEmail: userData.sellerEmail || '',
          sellerAddress: userData.sellerAddress || '',
          productName: userData.productName || '',  // Set initial productName if available
          productDescription: userData.productDescription || '',
        });
      }
    };

    fetchUserData();
  }, []);

  const getUserData = async () => {
    return {
      sellerName: 'John Doe',
      sellerPhone: '1234567890',
      sellerEmail: 'john.doe@example.com',
      sellerAddress: '123 Main St, Springfield',
      productName: 'Sample Product',  // Initial product name
      productDescription: 'Sample product description',
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data to match backend requirements
    const requestData = {
      userName: formData.sellerName,
      userAddress: formData.sellerAddress,
      userPhone: formData.sellerPhone,
      productName: formData.productName,
      productDescription: formData.productDescription,
      itemImages: imgUrls, 
    };

    try {
      const response = await fetch("/api/user/seller/charity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response Data:', data);
        setOpenPopup(true);
      } else {
        console.error("Failed to submit data:", await response.text());
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleViewProduct = () => {
    handleClosePopup();
    navigate('/part2/ProductList');
  };

  const handleGoHome = () => {
    handleClosePopup();
    navigate('/home');
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 18 }}>
      <Card>
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <Typography variant="h5" textAlign="center" gutterBottom>
              Sell Your Reusable Items
            </Typography>

            <TextField
              label="Name of Seller"
              name="sellerName"
              value={formData.sellerName}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Phone Number"
              name="sellerPhone"
              type="tel"
              value={formData.sellerPhone}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Email"
              name="sellerEmail"
              type="email"
              value={formData.sellerEmail}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Address"
              name="sellerAddress"
              value={formData.sellerAddress}
              onChange={handleChange}
              fullWidth
              required
              multiline
              rows={3}
            />

            <TextField
              label="Product Name"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Product Description"
              name="productDescription"
              value={formData.productDescription}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />

            <Button
              variant="contained"
              component="label"
              startIcon={<PhotoCamera />}
              sx={{ mt: 2 }}
            >
              Upload Product Images
              <input
                type="file"
                accept="image/*"
                hidden
                multiple
                onChange={handleImageChange}
              />
            </Button>

            {/* Image Preview Section */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
              {imgUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Product Preview ${index + 1}`}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                />
              ))}
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ mt: 2 }}
            >
              Continue to Sell
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Popup Modal */}
      <Dialog open={openPopup} onClose={handleClosePopup}>
        <DialogTitle>Congratulations!</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Your product has been successfully added.
          </Typography>
          <Typography variant="body2" gutterBottom>
            Would you like to view your product or go to the product list?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleGoHome} color="secondary">
            Go to Home
          </Button>
          <Button onClick={handleViewProduct} color="primary">
            View Product
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default SellerOLXForm;
