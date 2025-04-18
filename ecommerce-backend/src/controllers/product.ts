import { Request } from "express";
import { FilterQuery } from "mongoose";
import { TryCatch } from "../middlewares/error.js";
import { BaseQuery, NewProductRequestBody, SearchRequestQuery } from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";

// Revalidate on New, Update, delete product
export const getLatestProducts = TryCatch(async(req, res, next) => {
    let products;

    if(myCache.has('latest-products')) 
        products = JSON.parse(myCache.get('latest-products') as string);
    else {
        products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
        myCache.set('latest-products', JSON.stringify(products));
    }

    return res.status(200).json({
        success: true,
        products,
    });
});

// Revalidate on New, Update, delete product
export const getAllCategories = TryCatch(async(req, res, next) => {
    let categories;

    if(myCache.has('categories')) 
        categories = JSON.parse(myCache.get('categories'));
    else {
        categories = await Product.distinct("category");
        myCache.set('categories', JSON.stringify(categories));
    }

    return res.status(200).json({
        success: true,
        categories,
    });
});

// Revalidate on New, Update, delete product
export const getAdminProducts = TryCatch(async(req, res, next) => {
    let products;

    if(myCache.has('all-products'))
        products = JSON.parse(myCache.get('all-products'));
    else {
        products = await Product.find({});
        myCache.set('all-products', JSON.stringify(products));
    }

    return res.status(200).json({
        success: true,
        products,
    });
});

// Revalidate on New, Update, delete product
export const getSingleProduct = TryCatch(async(req, res, next) => {
    const { id } = req.params;
    let product;

    if(myCache.has(`product-${id}`))
        product = JSON.parse(myCache.get(`product-${id}`));
    else {
        product = await Product.findById(id);
        if(!product) return next(new ErrorHandler("Product not found", 404));
        myCache.set(`product-${id}`, JSON.stringify(product));
    }

    return res.status(200).json({
        success: true,
        product,
    });
});

export const newProduct = TryCatch(async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { name, category, price, stock } = req.body;

    const photo = req.file;

    if(!photo) return next(new ErrorHandler("Please add a photo", 400));

    if(!name || !category || !price || !stock) {
        // remove the photo from uploads folder which got added by singleUpload method
        rm(photo.path, () => console.log("Deleted"));
        return next(new ErrorHandler("Please fill all the fields", 400));
    }

    await Product.create({
        name,
        price,
        stock,
        category: category.toLowerCase(),
        photo: photo.path,
    });

    await invalidateCache({ product: true });

    return res.status(201).json({
        success: true,
        message: "Product created successfully",
    });
});

export const updateProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { name, category, price, stock } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);

    if(!product) return next(new ErrorHandler("Product not found", 404));

    if(photo) {
        rm(product.photo, () => console.log("Old photo deleted"));
        product.photo = photo.path;
    }

    if(name) product.name = name;
    if(stock) product.stock = stock;
    if(category) product.category = category;
    if(price) product.price = price;

    await product.save();

    await invalidateCache({ product: true, productId: String(product._id) });

    return res.status(201).json({
        success: true,
        message: "Product updated successfully",
    });
});

export const deleteProduct = TryCatch(async(req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);

    if(!product) return next(new ErrorHandler("Product not found", 404));

    rm(product.photo, () => {
        console.log("Product photo deleted")
    })
    await product.deleteOne();

    await invalidateCache({ product: true, productId: String(product._id) });

    return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
});

export const getAllProduct = TryCatch(async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { price, category, sort, search } = req.query;
    const page = Number(req.query.page);

    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;

    const baseQuery: FilterQuery<BaseQuery> = {};

    if(search) {
        baseQuery.name = {
            $regex: search,
            $options: 'i',
        };
    }

    if(price) {
        baseQuery.price = {
            $lte: Number(price),
        };
    }

    if(category) baseQuery.category = category;

    const productsPromise = Product.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip);

    const [products, filteredOnlyProduct] = await Promise.all([
        productsPromise, 
        Product.find(baseQuery),
    ]);

    const totalPages = Math.ceil(filteredOnlyProduct.length / limit);

    return res.status(200).json({
        success: true,
        products,
        totalPages,
    })
});