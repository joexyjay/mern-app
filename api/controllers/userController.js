import  errorHandler  from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/userModel.js";
export const test = (req, res) => {
    res.json({
        msg: "Hello World"
    })
}

export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) {
        return next(errorHandler("You are not authorized to perform this action", 401))
    }
    try {
        if(req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture,
            }
        }, { new: true })
        const { password, ...others } = updatedUser._doc;
        res.status(200).json(others);
    } catch (error) {
        next(error)
    }
}