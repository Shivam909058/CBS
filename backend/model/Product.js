import mongoose from "mongoose";
import { Schema } from "mongoose";

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    image: [{
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^https?:\/\/.+/.test(v);
            },
            message: 'Invalid image URL format'
        }
    }],
    seller: {
        type: Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    c: {
        type: Number,
        default: 0,
        enum: [0, 1]
    }
}, {
    timestamps: true
});

export default mongoose.model("Product", ProductSchema);