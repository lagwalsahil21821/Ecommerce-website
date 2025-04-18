import mongoose from "mongoose";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";

export const connectDB = (uri: string) => {
    mongoose.connect(uri, {
        dbName: "Ecommerce_website",
    })
    .then(c => console.log(`DB connected to ${c.connection.host}`))
    .catch((e) => console.log(e))
}

export const invalidateCache = async ({ product, order, admin, userId, orderId, productId }: InvalidateCacheProps) => {
    if(product) {
        const productKeys: string[] = ['latest-products', 'all-products', 'categories'];
        
        if(typeof productId === 'string') 
            productKeys.push(`product-${productId}`);

        if(typeof productId === 'object') 
            productId.forEach((id) => productKeys.push(`product-${id}`));

        myCache.del(productKeys);
    }
    if(order) {
        const orderKeys: string[] = ['all-orders', `my-orders-${userId}`, `order-${orderId}`];
        myCache.del(orderKeys);
    }
    if(admin) {
        
    }
}

export const reduceStock = async (orderItems: OrderItemType[]) => {
    for(let i = 0; i<orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if(!product) 
            throw new Error('Product not found');

        product.stock -= order.quantity;
        await product.save();
    }
}
