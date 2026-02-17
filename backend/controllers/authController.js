import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const signup = async (req, res) => {
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
            process.env.JWT_SECRET,
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

}

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "user not found" });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ msg: "incorrect passwrord" });

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
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
}
