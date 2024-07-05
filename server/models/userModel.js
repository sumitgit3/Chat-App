import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    username: {
        type:String,
        required:true,
        min: 3,
        max : 20,
        unique:true
    },
    email: {
        type:String,
        required:true,
        unique:true,
        max:50
    },
    password : {
        type:String,
        required:true,
        min:8
    },
    isAvatarImageSet : {
        type:Boolean,
        default:false
    },
    avatarImage : {
        type:"String",
        default:""
    }
});

const User = mongoose.model('User',userSchema);
export default User;