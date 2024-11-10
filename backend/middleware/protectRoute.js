import Buyer from "../model/Buyer.js"
import Seller from "../model/Seller.js"
import jwt from "jsonwebtoken"
const protectRoute = async(req,res,next) => {
    try {
        const token = req.cookies.jwt
        if(!token){
            res.status(401).json({message:"Unauthorized user"})
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const buyer = await Buyer.findById(decoded.userId).select("-password")
        const seller = await Seller.findById(decoded.userId).select("-password")
        req.user = buyer||seller
        next()
    } catch (error) {
        console.log(error)
    }
}


export default protectRoute;