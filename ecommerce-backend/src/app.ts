import express from 'express'

// importing routes
import userRoute from './routes/user.js'

const port = 3000;
const app = express();

app.get("/", (req, res) => {
    res.end("Hello World");
})

// using Routes
app.use("/api/v1/user", userRoute)

app.listen(port, () => {
    console.log(`Node is working on http://localhost:${port}`)
})