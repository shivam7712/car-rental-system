import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
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
}