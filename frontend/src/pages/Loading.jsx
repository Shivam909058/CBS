import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

function Loading() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5',
            }}
        >
            <CircularProgress
                size={60}
                sx={{
                    color: '#1976d2', // Customize color as needed
                    mb: 2, // Margin below the spinner
                }}
            />
            <Typography variant="h6" color="textSecondary">
                Loading, please wait...
            </Typography>
        </Box>
    );
}

export default Loading;
