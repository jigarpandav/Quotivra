const mongoose = require('mongoose');


const connectDB = async() => {
    try{ 
        const db = await mongoose.connect(process.env.MONGO_URL)
       console.log("MongoDB Connected Successfully")
    }catch(err) {
        console.error(`MongoDB connection failed: ${err.message}`);
        console.error(`Check that MongoDB is running and MONGO_URL is correct: ${process.env.MONGO_URL}`);
        process.exit(1);

    }
}
module.exports = connectDB;
