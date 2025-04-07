import mongoose from "mongoose"

export const connectDB = () => {
    mongoose.connect( "mongodb://localhost:27017", {
        dbName: "Ecommerce_website",
    })
    .then(c => console.log(`DB connected to ${c.connection.host}`))
    .catch((e) => console.log(e))
}