import React from "react";
import hero from "../assets/hero.png";
import Box from '@mui/material/Box';
import { Typography, Card, CardMedia, CardContent, Grid } from '@mui/material';

function Hero() {
    return (
        <>
            {/* Hero Section */}
            <Box sx={{ padding: 3, marginTop: '100px', display: 'flex', justifyContent: 'center' }}>
                <Card sx={{ display: 'flex', maxWidth: 1200 }}>
                    
                    {/* Left-aligned Image */}
                    <CardMedia
                        component="img"
                        sx={{ width: '50%' }}
                        image={hero}
                        alt="hero"
                    />
                    
                    {/* Right-aligned Text Content */}
                    <CardContent sx={{ padding: 3, width: '50%' }}>
    <Typography variant="h3" gutterBottom>
        Home $crapper: Turning Waste into Value
    </Typography>
    <Typography variant="h5" gutterBottom>
        Recyclable Waste Marketplace
    </Typography>
    <Typography variant="body1" sx={{ color: 'text.secondary', marginBottom: 2 }}>
        Connect with trusted vendors for fair pricing and accurate weighing of your recyclable household waste. Home $crapper acts as a mediator, ensuring transparency and reliability, helping you earn back value on items like newspapers, plastics, and more, while promoting responsible recycling.
    </Typography>
    <Typography variant="h5" gutterBottom>
        Give a Second Life to Your Belongings
    </Typography>
    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        Donate or sell items like books and electronics to people who need them, fostering a sustainable community. Whether donating or selling at low cost, Home $crapper makes it easy to repurpose valuable items and reduce waste.
    </Typography>
</CardContent>

                </Card>
            </Box>
        </>
    );
}

export default Hero;