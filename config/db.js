const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to MongoDB : ${conn.connection.host}`);
    } catch (error) {
        console.log("Error in Connection MongoDB :", error.message);
        process.exit(1); // 1 is Failure, 0 status is Success
    }
}

module.exports = connectDB;