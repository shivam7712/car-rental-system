import User from '../models/User.js'

export const checkDuplicateEmail = async (req, res, next) => {

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