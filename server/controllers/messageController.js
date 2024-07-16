import Message from "../models/messageModel.js";

const addmessage = async (req,res,next)=>{
    try {
        const {from,to,message} = req.body;
        const response = await Message.create({
            message: {text:message},
            users : [from,to],
            sender : from
        });
        if (response) {
            return res.json({msg:"Message added successfully"});
        }
        else {
            return res.json({msg:"Failed to add message to the database"});
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}
//getallmessage controller
const getallmessage = async (req,res,next)=>{
    try {
        const {from,to} = req.body;
        const message = await Message.find({users :{$all :[from,to]}}).sort({updatedAt:1});
        const responseMessage  = message.map((msg)=>{
            return {
                fromSelf : msg.sender.toString() === from,
                message : msg.message.text
            }
        });
        res.json(responseMessage);
    } catch (error) {
        next(error);
    }
}

export {addmessage,getallmessage};