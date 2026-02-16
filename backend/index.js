import express from 'express'
import mongoose from 'mongoose'
import User from './models/User.js'
import Booking from './models/Booking.js'
import Car from './models/Car.js'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';
import { z } from 'zod';

dotenv.config();

const DB_URL = process.env.MONGODB_URI;
const jwtKey = process.env.JWT_SECRET;

const port = 8000;
const app = express();

app.use(express.json());

const signupSchema = z.object({
    name: z.string().min(2, "Name is requried"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 chars")
})

const signinSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 chars")
})


    (async () => {
        try {
            await mongoose.connect(DB_URL);
            console.log("connection successfull");
        }
        catch (err) {
            console.log(err.message);
        }
    })()

const checkDuplicateEmail = async (req, res, next) => {

    try {
        const { email } = req.body;
        const userExists = await User.exists({ email })

        if (userExists) {
            return res.status(400).json({
                msg: "user already exists"
            })
        }
        return next();

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
}

const validate = (schema) => (req, res, next) => {

    const result = schema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({ error: result.error.errors });
    }
    console.log("validation success")
    next();
}

app.get('/api/users', async (req, res) => {
    try {
        const allusers = await User.find({}).select("-password");
        res.json({
            msg: "success",
            data: allusers
        })
    }
    catch (err) {
        console.log(err.message)
    }
})

app.post('/api/auth/signup', validate(signupSchema), checkDuplicateEmail, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound)

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "customer"
        })

        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role },
            jwtKey,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            msg: "user created successfully",
            token
        });
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json({ msg: "server error" });
    }

})

app.post('/api/auth/signin', validate(signinSchema), async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "user not found" });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ msg: "incorrect passwrord" });

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            jwtKey,
            { expiresIn: "1d" }
        )

        res.status(201).json({
            msg: "signin success",
            token
        })
    }
    catch(err) {
        res.status(500).json({msg: "server error"})
    }
})

app.listen(port, () =>
    console.log(`server is running on port: ${port}`)
)