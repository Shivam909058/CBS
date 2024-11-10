import Buyer from "../model/Buyer.js"
import Product from "../model/Product.js";
import Seller from "../model/Seller.js"
import generateTokenAndSetCookie from "../utils/helper/cookies.js"
import { v2 as cloudinary } from "cloudinary";


const Adduser = async (req, res) => {
    try {
        const {email} = req.body
        console.log("wokring",req.body)

        if(!email){
            return res.status(400).json({ message: "All fields are required" })
        }
        const buyer = await Buyer.create({  email })
        const seller = await Seller.create({ email })
        if(buyer && seller){
            generateTokenAndSetCookie(buyer._id, res);
            generateTokenAndSetCookie(seller._id, res);
        }
        res.status(201).json({ buyer,seller })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}



const buyerInfoFill = async (req, res) => {
    try {
      const { shopName, vendorAddress, vendorPhone, tradingDescription, shopImage } = req.body;
  
        console.log("shopImage",shopImage);
  
  
      // Find or create buyer
      const id = req.user._id;
      const SearchBuyer = await Buyer.findById(id);
      const SearchSeller = await Seller.findById(id);
  
      if (SearchBuyer) {
        if(shopImage){
            var uploadedResponse = await cloudinary.uploader.upload(shopImage);
            var  imageUrl = uploadedResponse.secure_url;
        }
        SearchBuyer.name = shopName;
        SearchBuyer.address = vendorAddress;
        SearchBuyer.phone = vendorPhone;
        SearchBuyer.image = imageUrl||null;
        const buyer = await SearchBuyer.save();
  
        return res.status(201).json({ buyer });
      } else {
        if(shopImage){
            var uploadedResponse = await cloudinary.uploader.upload(shopImage);
            var  imageUrl = uploadedResponse.secure_url;
        }
        const buyer = await Buyer.create({
          name: shopName,
          address: vendorAddress,
          phone: vendorPhone,
          image: imageUrl||null,
          email: SearchSeller.email,
        });
  
        return res.status(201).json({ buyer });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

  const charitySeller = async (req, res) => {
    const { userName, userAddress, userPhone, productName, productDescription, itemImages, image } = req.body;
    const id = req.user?._id;
    const SearchSeller = await Seller.findById(id);

    if (SearchSeller) {
        const uploadedImages = [];  

        if (Array.isArray(itemImages)) {
            for (const img of itemImages) {
                console.log(typeof img, "img");
                if (typeof img === "string" && img.trim() !== "") {
                    try {
                        const uploadedResponse = await cloudinary.uploader.upload(img);
                        uploadedImages.push(uploadedResponse.secure_url); 
                    } catch (error) {
                        console.error("Error uploading image:", error);
                    }
                }
            }
        }
        console.log(uploadedImages,"uploadedImages")
        const product = await Product.create({
            name: productName,
            c:1,
            description: productDescription,
            image: uploadedImages  
        });

        let uploadedImageURL = "";
        if (image) {
            const uploadedResponse = await cloudinary.uploader.upload(image);
            uploadedImageURL = uploadedResponse.secure_url;
        }

        SearchSeller.name = userName;
        SearchSeller.email,
        SearchSeller.address = userAddress;
        SearchSeller.image = uploadedImageURL;
        SearchSeller.phone = userPhone;
        SearchSeller.Product.push(product._id);

        const seller = await SearchSeller.save();
        console.log(uploadedImageURL, "uploadedImages");
        res.status(201).json({ seller });
    } else {
        res.status(404).json({ message: "Seller not found" });
    }
  }

const sellerInfoFill = async (req, res) => {
    try {
        const { userName, userAddress, userPhone, productName, productDescription, itemImages, image } = req.body;
        
        if (!userName || !userAddress || !userPhone || !productName || !productDescription) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        const id = req.user?._id;
        if (!id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const SearchSeller = await Seller.findById(id);
        if (!SearchSeller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        const uploadedImages = [];  

        if (Array.isArray(itemImages)) {
            for (const img of itemImages) {
                console.log(typeof img, "img");
                if (typeof img === "string" && img.trim() !== "") {
                    try {
                        const uploadedResponse = await cloudinary.uploader.upload(img);
                        uploadedImages.push(uploadedResponse.secure_url); 
                    } catch (error) {
                        console.error("Error uploading image:", error);
                    }
                }
            }
        }
        console.log(uploadedImages,"uploadedImages")
        const product = await Product.create({
            name: productName,
            description: productDescription,
            image: uploadedImages, 
            c:1
        });

        let uploadedImageURL = "";
        if (image) {
            const uploadedResponse = await cloudinary.uploader.upload(image);
            uploadedImageURL = uploadedResponse.secure_url;
        }

        SearchSeller.name = userName;
        SearchSeller.email,
        SearchSeller.address = userAddress;
        SearchSeller.image = uploadedImageURL;
        SearchSeller.phone = userPhone;
        SearchSeller.Product.push(product._id);

        const seller = await SearchSeller.save();
        console.log(uploadedImageURL, "uploadedImages");
        try {
            const response = await fetch("http://127.0.0.1:8000/classify-scrap/", { // use backend url here to fetch the results 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(uploadedImages),
            });

            if (!response.ok) {
                console.error("Failed to fetch suggestions:", await response.text());
                return res.status(500).json({ message: "Failed to fetch recycling suggestions" });
            }

            const suggestions = await response.json();
            res.status(201).json({ seller, suggestions });
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            res.status(500).json({ message: "An error occurred while fetching suggestions" });
        }
    } catch (error) {
        console.error("Error in sellerInfoFill:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const fetchProduct = async(req,res) => {
    try {
        const getProduct = await Product.find({ 
            c:1
        }).populate("seller")
        console.log(getProduct,"getProduct");
        res.status(200).json(getProduct)
    } catch (error) {
        console.log(error)
        res.status(404).json(error)
    }
}

const fetchProductcharity = async(req,res) => {
    try {
        const getProduct = await Product.find({ 
            c:0
        }).populate("seller")
        console.log(getProduct,"getProduct");
        res.status(200).json(getProduct)
    } catch (error) {
        console.log(error)
        res.status(404).json(error)
    }
}

const ShowProduct = async(req,res)=>{
    try {
        const {Pid} = req.params;
        const getProduct = await Product.findById(Pid).populate("seller")
        console.log("getProduct",getProduct);
        res.status(200).json(getProduct)
    } catch (error) {
        console.log(error)
        res.status(404).json(error);
    }
}

const Logout = async(req,res) => {
    res.clearCookie("jwt");
    res.status(200).json({message:"Logout successfully"})
}

const searchProduct = async(req,res) => {
    try {
        const {name} = req.query;
        const searchProduct = await Product.find({
            $or: [
                { name: { $regex: name, $options: "i" } },
                { description: { $regex: name, $options: "i" } },
            ],
        }).populate("seller")
        //now we need to sort according to the rating of the product 
        const sortedProduct = searchProduct.sort((a, b) => b.rating - a.rating);
        console.log(searchProduct,"searchProduct","sortedProduct",sortedProduct);
        res.status(200).json(sortedProduct)
    } catch (error) {
        console.log(error)
        res.status(404).json(error)
    }
}

const giveFeedback = async (req, res) => {
    try {
        const { Pid } = req.params;
        const { feedback } = req.body;

        const product = await Product.findById(Pid);

        // const sentimentResponse = await axios.post('http://127.0.0.1:8000/analyze-feedback/', {
        //     feedback: feedback,
        //     vendor_id: product.vendor_id
        // });
        const sendedFeedback = {
            text: feedback,
        }
        console.log("Found product",sendedFeedback);
        const sentimentResponse = await fetch('http://127.0.0.1:8000/analyze-feedback/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendedFeedback)
        });
    
        // Parse the JSON response
        const data = await sentimentResponse.json();
        console.log('Received sentiment from FastAPI:', data.sentiment);
        if(data.sentiment){
            product.rating += 1;
        }else{
            product.rating -= 1;
        }

        const updatedProduct = await product.save();

        console.log(`Updated product rating: ${updatedProduct.rating}`);

        res.status(200).json({ updatedProduct });
    } catch (error) {
        console.log("Error in giveFeedback:", error);
        res.status(404).json({ error: error.message });
    }
};

const fetchVender = async(req,res) => {
    try {
        const AllVender = await Buyer.find()
        console.log(AllVender,"AllVender");

        res.status(200).json(AllVender)
    } catch (error) {
        console.log(error)
    }
}


export { Adduser, fetchVender, fetchProductcharity, ShowProduct, Logout, charitySeller, buyerInfoFill, giveFeedback, searchProduct, sellerInfoFill, fetchProduct }