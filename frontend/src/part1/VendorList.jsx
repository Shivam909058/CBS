import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, CardMedia } from '@mui/material';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    // Fetch vendor data from local storage or an API
    const fetchVendors = async () => {
      const vendorData = [
        {
          id: 1,
          shopName: 'Example Shop 1',
          vendorName: 'Jane Doe',
          vendorPhone: '9876543210',
          vendorEmail: 'jane.doe@example.com',
          vendorAddress: '456 Market St, Springfield',
          tradingDescription: 'Example description of trading activity',
          shopImage: 'https://etimg.etb2bimg.com/photo/76159933.cms', 
        },
        {
          id: 2,
          shopName: 'Example Shop 2',
          vendorName: 'John Smith',
          vendorPhone: '1234567890',
          vendorEmail: 'john.smith@example.com',
          vendorAddress: '789 Elm St, Metropolis',
          tradingDescription: 'Another example of a shop’s activity',
          shopImage: 'https://bangaloremart.in/wp-content/uploads/2021/11/Scrap-Dealers-and-Buyers-in-Bangalore-9945555582-2048x662.jpg',  
        },
      ];

      setVendors(vendorData); 
    };

    fetchVendors();
  }, []);

  const renderVendorCard = (vendor) => (
    <Card key={vendor.id} sx={{ display: 'flex', mb: 4 }}>
      <CardMedia
        component="img"
        sx={{ width: 200, height: 200 }}
        image={vendor.shopImage || '/placeholder-image.jpg'} // Display placeholder if no image
        alt={`${vendor.shopName} image`}
      />
      <CardContent sx={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 3 }}>
        <Typography variant="h6">{vendor.shopName}</Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {vendor.tradingDescription}
        </Typography>
        <Box>
          <Typography variant="body2" color="text.secondary">Vendor: {vendor.vendorName}</Typography>
          <Typography variant="body2" color="text.secondary">Phone: {vendor.vendorPhone}</Typography>
          <Typography variant="body2" color="text.secondary">Email: {vendor.vendorEmail}</Typography>
          <Typography variant="body2" color="text.secondary">Address: {vendor.vendorAddress}</Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="md" sx={{ marginTop:  15}}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
        Vendor List
      </Typography>
      
      {vendors.length > 0 ? (
        vendors.map(renderVendorCard)
      ) : (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 6 }}>
          No vendors have registered yet.
        </Typography>
      )}
    </Container>
  );
};

export default VendorList;
