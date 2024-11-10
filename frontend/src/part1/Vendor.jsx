import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import usePreviewImg from '../hooks/usePreviewImg';

function VendorForm() {
  const [formData, setFormData] = useState({
    shopName: '',
    vendorPhone: '',
    vendorAddress: '',
    tradingDescription: '',
    shopImage: null,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const { handleImageChange, imgUrls, setImgUrls } = usePreviewImg();

  useEffect(() => {
    const fetchVendorData = async () => {
      const vendorData = await getVendorData();
      if (vendorData) {
        setFormData({
          shopName: vendorData.shopName || '',
          vendorPhone: vendorData.vendorPhone || '',
          vendorAddress: vendorData.vendorAddress || '',
          tradingDescription: vendorData.tradingDescription || '',
          shopImage: vendorData.shopImage || null,
        });
      }
    };
    fetchVendorData();
  }, []);

  const getVendorData = async () => {
    return {
      shopName: 'Example Shop',
      vendorPhone: '9876543210',
      vendorAddress: '456 Market St, Springfield',
      tradingDescription: 'Example description of trading activity',
      shopImage: null,
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

    const data = new FormData();
    data.append('shopName', formData.shopName);
    data.append('vendorPhone', formData.vendorPhone);
    data.append('vendorAddress', formData.vendorAddress);
    data.append('tradingDescription', formData.tradingDescription);

    if (formData.shopImage) {
      data.append('shopImage', formData.shopImage);
    }

    try {
      const res = await fetch('/api/user/buyer/buy', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        throw new Error('Failed to submit the form');
      }

      const result = await res.json();
      console.log('Response from backend:', result);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  };

  const handleDialogClose = (action) => {
    setOpenDialog(false);
    if (action === 'viewShops') {
      navigate('/part1/VendorList');
    } else if (action === 'goHome') {
      navigate('/home');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 18 }}>
      <Card>
        <CardContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5" textAlign="center" gutterBottom>
              Register Your Shop
            </Typography>

            <TextField
              label="Shop Name"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Phone Number"
              name="vendorPhone"
              type="tel"
              value={formData.vendorPhone}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Address"
              name="vendorAddress"
              value={formData.vendorAddress}
              onChange={handleChange}
              fullWidth
              required
              multiline
              rows={3}
            />
            <TextField
              label="Description"
              name="tradingDescription"
              value={formData.tradingDescription}
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
              Upload Shop Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  handleImageChange(e);
                  setFormData((prevData) => ({
                    ...prevData,
                    shopImage: e.target.files[0],
                  }));
                }}
              />
            </Button>

            {imgUrls.length > 0 && (
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                {imgUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Preview ${index + 1}`}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                    }}
                  />
                ))}
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleSubmit}
              sx={{ mt: 2 }}
            >
              Register Shop
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Registration Successful!</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Your shop has been registered successfully. What would you like to do next?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose('goHome')} color="secondary">
            Go to Home
          </Button>
          <Button onClick={() => handleDialogClose('viewShops')} color="primary">
            View Shop List
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default VendorForm;
