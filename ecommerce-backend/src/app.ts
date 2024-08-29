import express from 'express'

const port = 3001;
const app = express();

app.listen(port, () => {
    console.log(`Node is working on http://localhost:${port}`)
})