import User from '../models/userModel.js'
import bcrypt from 'bcrypt'

//Register Controller
const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const isUsernameAlreadyUsed = await User.findOne({ username });
        if (isUsernameAlreadyUsed) {
            return res.json({ msg: "Username already Used", status: false });
        }
        const isEmailAlreadyRegistered = await User.findOne({ email });
        if (isEmailAlreadyRegistered) {
            return res.json({ msg: "Email is already Registed", status: false });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        let user = await User.create({
            username,
            email,
            password: hashedPassword
        });
        const responseUser = {username,email};
        return res.json({ responseUser, status: true });
    } 
    catch (error) {
        next(error);
    }
}

//Login Controller
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const userExist= await User.findOne({ username });
        if (!userExist) {
            return res.json({ msg: "Please try again with correct credentials", status: false });
        }
        const isPasswordValid = await bcrypt.compare(password,userExist.password);
        if (!isPasswordValid) {
            return res.json({ msg: "Please try again with correct credentials", status: false });
        }
        const email = userExist.email;
        const responseUser = {username,email};
        return res.json({ responseUser, status: true });
    } 
    catch (error) {
        next(error);
    }
}
export { register,login };