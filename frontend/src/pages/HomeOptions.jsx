import React, { useEffect } from "react";

import options1 from "../assets/options1.png";
import options2 from "../assets/options2.png";



import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Card, CardMedia, CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';
/* import hello from "../part1/seller" */

import { useNavigate , useRoutes} from 'react-router-dom';
import { VoiceChat } from "@mui/icons-material";
import VoiceflowChat from "./VoiceflowChat";


function Options() {
    const navigate = useNavigate();
   


    const handleButtonClick1 = () => {
       navigate('/part1/Seller'); 
      };
      const handleButtonClick2 = () => {
        navigate('/part1/Vendor');
      };
      const handleButtonClick3 = () => {
        navigate('/part2/ProductList');
      };
    

    return (

        <>
        <div style={{display:"flex", justifyContent:'center'}}>
            {/* Recycle Section */}
            <Box sx={{ padding: 5 , marginTop: '100px', display: 'flex' }}>
            <Card sx={{ maxWidth: 600 }}>

                <CardMedia component="img" height="450" image={options1} alt="options1" />
               
                <CardContent>
                    <Typography variant="h4" gutterBottom sx={{ display:"flex", justifyContent:'center' }}>
                        Turning Waste into Value
                    </Typography>

                <br></br>
                <div style={{display:"flex", justifyContent:'center' , gap: '100px'}}>
                <Button variant="contained" sx={{ backgroundColor:'#298282'}}  onClick={handleButtonClick1} >Continue as SELLER</Button>
                <Button variant="contained" sx={{ backgroundColor:'#298282'}} onClick={handleButtonClick2}>Continue as VENDOR</Button>
                </div>
                <br></br>
                <br></br>


                    <Typography variant="h5" gutterBottom>
                    Step into the World of Recyclable Trade:
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', marginBottom: 2 }}>
                    Connect with trusted vendors for fair pricing and accurate weighing of recyclable household waste. Home $crapper ensures transparency and helps you reclaim value from items like newspapers and plastics, supporting responsible recycling.
                    </Typography>
                </CardContent>
            </Card>
        </Box>







             {/* Preowned Goods Section */}
             <Box sx={{ padding: 5 , marginTop: '100px', display: 'flex' }}>
            <Card sx={{ maxWidth: 600 }}>

                <CardMedia component="img" height="450" image={options2} alt="options2" />

               
                <CardContent>
                    <Typography variant="h4" gutterBottom sx={{ display:"flex", justifyContent:'center' }}>
                    Charity That Transforms
                    </Typography>
                <br></br>
                <div style={{display:"flex", justifyContent:'center' , gap: '100px' }}>
                <Button variant="contained" sx={{ backgroundColor:'#298282'}} onClick={handleButtonClick3}>Product List</Button>
                {/* {/<Button variant="contained" sx={{ backgroundColor:'#298282'}} onClick={handleButtonClick4}>Continue as BUYER</Button>/} */}
                </div>

                <br></br>
                <br></br>

                    <Typography variant="h5" gutterBottom>
                    Indulge in the world of Charitable Goods :
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Give your belongings a second life by donating or selling items like books and electronics to those in need. Home $crapper makes it easy to repurpose valuable items, fostering sustainability and reducing waste.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
<div>
<VoiceflowChat />
</div>
        </div>


        </>
    );
};

export default Options;