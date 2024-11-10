import React from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Button, Container, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { marked } from 'marked';

const ModelData = ({ modelData }) => {
  const navigate = useNavigate();

  const handleProductList = () => {
    navigate('/part1/ProductLists');   
  };

  const handleGoBack = () => {
    navigate('/part1/seller');
  };
  
  return (
    <Container maxWidth="md" sx={{ marginTop: 15 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
        Review of Processed Images
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <TextField
          label="Search reviews"
          variant="outlined"
          fullWidth
          sx={{ maxWidth: '100%', mr: 2 }}
          style={{ background: "white" }}
        />
      </Box>

      {modelData && modelData.map((data) => (
        <Card key={data.id} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 4, padding: 2, gap: '150px' }}>
          <CardMedia
            component="img"
            sx={{ width: 250, height: 200, marginRight: 2, marginLeft: 1 }}
            image={data.image_url}
            alt="Processed product image"
          />
          <CardContent sx={{ flex: 1 }} style={{ marginRight: '0px' }}>
            <Typography variant="h6" gutterBottom>
              Recommendation:
            </Typography>
            <div
              dangerouslySetInnerHTML={{
                __html: marked.parse(data.recommendation || "No recommendation available"),
              }}
            />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Recyclable: {data.recyclable ? "Yes" : "No"}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Recycling Rules:
            </Typography>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {data.recycling_rules && data.recycling_rules.length > 0
                ? data.recycling_rules.map((rule, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>
                      {rule}
                    </li>
                  ))
                : "No recycling rules available"}
            </ul>
          </CardContent>
        </Card>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, marginTop: 4 }}> 
        <Button variant="outlined" color="secondary" onClick={handleGoBack}>
          Re-upload Images
        </Button>
        <Button variant="contained" color="primary" onClick={handleProductList}>
          Continue to Sell
        </Button>
      </Box>
    </Container>
  );
};

export default ModelData;
