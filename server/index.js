import express from 'express'
import cors from "cors"
import {connect} from 'mongoose'
import dotenv from 'dotenv';
import authRouter from './routes/auth.js'

dotenv.config();
const app = express();
const port = process.env.PORT;
//connect to database
connect(process.env.MONGO_URI)
.then((res)=>{console.log("Connected to database")})
.catch((err)=>{console.log("Connection to database failed")});
//middleware->It reads the JSON payload from the request body, converts it into a JavaScript object, and attaches this object to the req.body property.
app.use(express.json());
app.use(cors());

//routes
app.use('/api/auth',authRouter);

//server listening
app.listen(port,()=>{
    console.log("Server listening on port:"+port);
})

