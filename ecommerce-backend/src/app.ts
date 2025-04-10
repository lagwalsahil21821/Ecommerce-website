import express from 'express';
import NodeCache from 'node-cache';
import { errorMiddleware } from './middlewares/error.js';
import { connectDB } from './utils/features.js';

// importing routes
import userRoute from './routes/user.js';
import productRoute from './routes/product.js';

const port = 3000;

// connect to database
connectDB();

export const myCache = new NodeCache();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API working with /api/v1")
    res.end("Hello World");
});

// using Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);

app.use("/uploads", express.static("uploads"));
// middleware for error handling
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Node is working on http://localhost:${port}`);
});