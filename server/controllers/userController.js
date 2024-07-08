import User from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
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
        const signatureKey = process.env.AUTH_SECRET_KEY;
        const payload = { id: user._id };
        const authToken = jwt.sign(
            payload, 
            signatureKey
            // { expiresIn: '1h' } //token expire in 1h
        );
        return res.json({ token:authToken,id:user._id ,status: true });
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
        //create a JWT Token
        const signatureKey = process.env.AUTH_SECRET_KEY;
        const payload = { id: userExist._id };
        const authToken = jwt.sign(
            payload, 
            signatureKey
            // { expiresIn: '1h' } //token expire in 1h
        );
        return res.json({ token:authToken,id:userExist._id ,status: true });
    } 
    catch (error) {
        next(error);
    }
}

//setavatar controller

const setavatar = async (req,res,next)=> {
    try {
        //find if user exist
        const userExists = await User.findById(req.params.id);
        if(!userExists) {
            return res.json({msg:"User not found",status:false});
        }
        const {image} = req.body;
        const newUser = {
            isAvatarImageSet:true,
            avatarImage:image
        }
        const user = await User.findByIdAndUpdate(req.params.id, { $set: newUser}, { new: true });
        res.json({msg:"Avatar set",status:true});

    } catch (error) {
        next(error);
    }
}
//getalluser controller
const getalluser = async (req,res,next)=>{
    try {
        const userId = req.params.id;
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
          ]);
        res.json(users);
    } catch (error) {
        next(error);
    }
}

export { register,login,setavatar,getalluser };