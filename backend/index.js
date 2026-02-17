import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config();

const DB_URL = process.env.MONGODB_URI;

const port = 8000;
const app = express();

app.use(express.json());

(async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log("connection successfull");
    }
    catch (err) {
        console.log(`error: ${err.message}`);
    }
})()

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes)

app.listen(port, () =>
    console.log(`server is running on port: ${port}`)
)