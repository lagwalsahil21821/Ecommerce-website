import mongoose from "mongoose"
import { InvalidateCacheProps } from "../types/types.js"
import { myCache } from "../app.js"
import { Product } from "../models/product.js"

export const connectDB = () => {
    mongoose.connect( "mongodb://localhost:27017", {
        dbName: "Ecommerce_website",
    })
    .then(c => console.log(`DB connected to ${c.connection.host}`))
    .catch((e) => console.log(e))
}

export const invalidateCache = async ({ product }: InvalidateCacheProps) => {
    if(product) {
        const productKeys: string[] = ['latest-products', 'all-products', 'categories'];
        const products = await Product.find({}).select('_id');

        products.forEach((product) => {
            productKeys.push(`product-${product._id}`);
        });

        myCache.del(productKeys);
    }
}