import express from "express";
import { Adduser, fetchVender, fetchProductcharity, charitySeller, buyerInfoFill, ShowProduct, giveFeedback, fetchProduct,searchProduct, Logout, sellerInfoFill } from "../controller/User.js";
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router();

router.post("/AddUser", Adduser);//as soon auth hua call it
router.post("/buyer/buy",protectRoute,buyerInfoFill)
router.post("/seller",protectRoute,sellerInfoFill)
router.post("/seller/charity",protectRoute,charitySeller)
router.get("/fetchProduct/charity",protectRoute,fetchProductcharity)
router.get("/fetchProduct",protectRoute,fetchProduct)
//charity
router.get("/fetchVender/fetch",protectRoute,fetchVender)
router.get("/logout",protectRoute,Logout)
router.get("/serach?name",protectRoute,searchProduct);
router.post("/Updatefeedback/:Pid",giveFeedback)
router.get("/:Pid",protectRoute,ShowProduct);

export default router
