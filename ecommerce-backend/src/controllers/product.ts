import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewProductRequestBody } from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";


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

    return res.status(201).json({
        success: true,
        message: "Product created successfully",
    });
});

export const getLatestProducts = TryCatch(async(req, res, next) => {
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);

    return res.status(200).json({
        success: true,
        products,
    });
});

export const getAllCategories = TryCatch(async(req, res, next) => {
    const categories = await Product.distinct("category");

    return res.status(200).json({
        success: true,
        categories,
    });
});

export const getAdminProducts = TryCatch(async(req, res, next) => {
    const products = await Product.find({});

    return res.status(200).json({
        success: true,
        products,
    });
});

export const getSingleProduct = TryCatch(async(req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);

    if(!product) return next(new ErrorHandler("Product not found", 404));

    return res.status(200).json({
        success: true,
        product,
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

    return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
});