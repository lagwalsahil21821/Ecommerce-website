import express from 'express';
import {
  deleteProduct,
  getAdminProducts,
  getAllCategories,
  getAllProduct,
  getLatestProducts,
  getSingleProduct,
  newProduct,
  updateProduct,
} from '../controllers/product.js';
import { adminOnly } from '../middlewares/auth.js';
import { singleUpload } from '../middlewares/multer.js';

const app = express.Router();

// route - /api/v1/product/new
app.post("/new", adminOnly, singleUpload, newProduct);

// route to get the latest products - /api/v1/product/latest
app.get("/latest", getLatestProducts);

// route to get the category - /api/v1/product/categories
app.get("/categories", getAllCategories);

// route get all the products - /api/v1/product/admin-products
app.get("/admin-products", adminOnly, getAdminProducts);

// route to get all the products with filters - /api/v1/product/all
app.get("/all", getAllProduct);

// route - /api/v1/product/:id
app
  .route("/:id")
  .get(getSingleProduct)
  .put(adminOnly, singleUpload, updateProduct)
  .delete(adminOnly, deleteProduct);

export default app;