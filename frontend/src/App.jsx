
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
//appbar  , login , logout
import AppBar from './pages/Appbar.jsx';  // Import AppBar component
import LoginButton from './pages/Login.jsx';
import LogoutButton from './pages/Logout.jsx';
//Home page for login and logout
import Home from "./pages/HomeOptions.jsx"
import Hero from "./pages/Hero.jsx";
//Trade section
import SellerForm from "./part1/Seller.jsx";
import ModelData from "./part1/ModelData.jsx";
import ProductLists from "./part1/ProductLists.jsx";
import VendorForm from "./part1/Vendor.jsx";
import VendorList from "./part1/VendorList.jsx";
//Charity here
import SellerOLXForm from "./part2/Seller.jsx";
import BuyerOLXForm from "./part2/Buyer.jsx";
import ProductList from "./part2/ProductList.jsx";
import MyProfile from './pages/MyProfile.jsx';

import Contact from './pages/Contact.jsx';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import userAtom from './atom/userAtom.js';

function App() {
  const { isAuthenticated,user } = useAuth0();
  console.log(isAuthenticated,user);
  const [userSave,setUser] = useRecoilState(userAtom);
  const getUser = async(user)=>{
    try {
      const Iuser = {
        email:user.email
      }
      const res = await fetch("/api/user/AddUser",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(Iuser)
      })
      const data = await res.json();
      setUser(data)
      localStorage.setItem("user-hackcbs", JSON.stringify(data));
      console.log(userSave,"data");
    } catch (error) {
      console.log(error);
    }
    
  }
  useEffect(()=>{
    if(isAuthenticated){
      getUser(user);
    }
  },[user])
  return (
    <Router>
      <>
        <AppBar />
        <div>
          <Routes>
           
          <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <Hero />}/>
          <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" replace />} />

            <Route path="/login" element={<LoginButton />} />
            <Route path="/logout" element={<LogoutButton />} />

            <Route path="/part1/Seller" element={<SellerForm />} />
            <Route path="/part1/ModelData" element={<ModelData />} />
            <Route path="/part1/ProductLists" element={<ProductLists />} />
            <Route path="/part1/Vendor" element={<VendorForm />} />
            <Route path="/part1/VendorList" element={<VendorList />} />

            <Route path="/part2/Seller" element={<SellerOLXForm />} />
            <Route path="/part2/Buyer" element={<BuyerOLXForm />} />
            <Route path="/part2/ProductList" element={<ProductList />} />
    
            <Route path="/MyProfile" element={<MyProfile/>}/>
            <Route path="/contact" element={<Contact />} />


          </Routes>
        </div>
      </>
    </Router>
  );
}

export default App;
