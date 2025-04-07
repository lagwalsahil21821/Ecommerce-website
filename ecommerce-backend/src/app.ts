import express from 'express'
import { connectDB } from './utils/features.js';

// importing routes
import userRoute from './routes/user.js'
import { errorMiddleware } from './middlewares/error.js';

const port = 3000;

// connect to database
connectDB();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API working with /api/v1")
    res.end("Hello World");
});

// using Routes
app.use("/api/v1/user", userRoute);

// middleware for error handling
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Node is working on http://localhost:${port}`)
});