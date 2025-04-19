import express from 'express';
import NodeCache from 'node-cache';
import morgan from 'morgan';
import { config } from 'dotenv';
import { errorMiddleware } from './middlewares/error.js';
import { connectDB } from './utils/features.js';

// importing routes
import userRoute from './routes/user.js';
import productRoute from './routes/product.js';
import orderRoute from './routes/order.js';
import paymentRoute from './routes/payment.js';
import dashboardRoute from './routes/stats.js';

config({
    path: './.env',
});

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI || "";

console.log(port);

// connect to database
connectDB(mongoURI);

export const myCache = new NodeCache();

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.send("API working with /api/v1")
    res.end("Hello World");
});

// using Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);

app.use("/uploads", express.static("uploads"));
// middleware for error handling
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Node is working on http://localhost:${port}`);
});