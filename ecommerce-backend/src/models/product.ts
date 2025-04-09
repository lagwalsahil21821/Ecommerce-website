import mongoose from 'mongoose';

const schema = new mongoose.Schema(
    {
        "name": {
            type: String,
            required: [true, "Please enter product name"],
        },
        "photo": {
            type: String,
            required: [true, "Please add photo"],
        },
        "category": {
            type: String,
            required: [true, "Please enter category"],
            trim: true,
        },
        "price": {
            type: String,
            required: [true, "Please enter price"],
        },
        "stock": {
            type: String,
            required: [true, "Please enter stock"],
        }
    }, 
    {
        timestamps: true,
    }
);

export const Product = mongoose.model('Product', schema);