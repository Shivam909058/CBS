import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Button, Container, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [purchasedProducts, setPurchasedProducts] = useState([]);  
  const [selectedProduct, setSelectedProduct] = useState(null);  
  const [feedback, setFeedback] = useState(''); 
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false); 

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await fetch('/api/user/fetchProduct/charity');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
  }, []);

  const handleSell = () => {
    navigate('/part2/Seller');
  };

  const handleBuy = (productId) => {
    setSelectedProduct(productId); 
    setIsFeedbackDialogOpen(true); 
  };

  // Handle feedback submission
  const handleFeedbackSubmit = async () => {
    if (!selectedProduct) return;

    try {
      const response = await fetch(`/api/user/Updatefeedback/${selectedProduct}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback }), // Send feedback in request body
      });

      if (response.ok) {
        setPurchasedProducts((prev) => [...prev, selectedProduct]); // Mark product as purchased
        setFeedback(''); // Clear feedback input
        setIsFeedbackDialogOpen(false); // Close dialog
      } else {
        console.error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error during feedback submission:", error);
    }
  };

  // Render each product card
  const renderProductCard = (product) => {
    const isPurchased = purchasedProducts.includes(product._id);

    return (
      <Card key={product._id} sx={{ display: 'flex', mb: 4, boxShadow: 3, borderRadius: 2 }}>
        <CardMedia
          component="img"
          sx={{ width: 250, borderRadius: '8px 0 0 8px' }}
          image={product.image[0]}
          alt={`${product.name} image`}
        />

        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 3 }}>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {product.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {product.details}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            {isPurchased ? (
              <Button variant="contained" color="success" disabled>
                ✔ Purchased
              </Button>
            ) : (
              <Button variant="contained" color="secondary" onClick={() => handleBuy(product._id)}>
                Buy
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 20 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ textAlign: 'center' }}>
        Product List
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <TextField
          label="Search products"
          variant="outlined"
          fullWidth
          sx={{ maxWidth: '80%', mr: 2 }}
          style={{ background: "white" }}
        />
        <Button variant="contained" color="primary" onClick={handleSell}>
          Sell Your Product
        </Button>
      </Box>

      {products.map(renderProductCard)}

      {/* Feedback Dialog */}
      <Dialog open={isFeedbackDialogOpen} onClose={() => setIsFeedbackDialogOpen(false)}>
        <DialogTitle>Give Feedback</DialogTitle>
        <DialogContent>
          <TextField
            label="Your feedback"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsFeedbackDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleFeedbackSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductList;