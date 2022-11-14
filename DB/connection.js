import mongoose from 'mongoose';
const connection = async () => {
    return await mongoose.connect(process.env.DB_connection)
        .then(() => {
            console.log("Database connected");
        }).catch((error) => {
            console.log("Database connection error", error);
        })
}

export default connection;