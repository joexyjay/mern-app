import User from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
import errorHandler from '../utils/error.js';
import jwt from 'jsonwebtoken';
export const signup = async (req, res, next) => {
   try {
        const { username, email, password } = req.body;
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save()
        res.status(201).json({
            msg: "User created successfully",
            newUser
        })
   } catch (error) {
         next(error)
   }
};

export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, "User not found"));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(401, "Wrong credentials"));
        }
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        const { password: userPassword, ...user } = validUser._doc;
        res
            .cookie("access_token", token, { httpOnly: true })
            .status(200)
            .json({
                msg: "User logged in successfully",
                user
        });

    } catch (error) {
        next(error)
    }
};