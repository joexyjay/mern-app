import User from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
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