import express from 'express'
import mongoose from 'mongoose'
import User from './models/User.js'
import Booking from './models/Booking.js'
import Car from './models/Car.js'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config();

const DB_URL = process.env.MONGODB_URI;
const jwtKey = process.env.JWT_SECRET;

const port = 8000;
const app = express();

app.use(express.json());

(async()=>{
    try {
        await mongoose.connect(DB_URL);
        console.log("connection successfull");
    }
    catch (err) {
        console.log(err.message);
    }
})()

const checkDuplicateEmail = async(req, res, next) => {

    try {
        const {email} = req.body;
        const userExists = await User.exists({email})

        if(userExists) {
            return res.status(400).json({
                msg: "user already exists"
            })
        }
        next();

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
}

app.get('/users', async(req, res)=>{
    try {
        const allusers = await User.find({});
        res.json({
            msg: "success",
            data: allusers
        })
    }
    catch (err) {
        console.log(err.message)
    }
})

app.post('/api/auth/signup', checkDuplicateEmail ,async(req, res)=>{
    try {
        const {name, email, password, role} = req.body;
        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound)

        await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "customer"
        })

        res.json({msg: "user created successfully"});
    }
    catch(err) {
        console.log(err.message)
        res.status(500).json({msg: "server error"});
    }

})


app.listen(port, ()=>
    console.log(`server is running on port: ${port}`)
)