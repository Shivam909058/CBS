import mongoose from "mongoose";
import { Schema } from "mongoose";

const SellerSchema = new Schema({
    name:{
        type: String,
    },
    email:{
        type: String,
        required: true
    },
    address:{
        type: String,
    },
    phone:{
        type: Number,
    },
    Product:[{
        type: Schema.Types.ObjectId,
        ref: "Product"
    }],
    rating:{
        type:Number,
        default:0
    },
    image:{
        type: String,
    }
})

export default mongoose.model("Seller", SellerSchema)