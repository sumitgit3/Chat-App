import express from 'express'
import  {register,login,setavatar,getalluser}  from '../controllers/userController.js';

const router = express.Router();

//Route 1: Register route /api/auth/register
router.post('/register',register);

//Route 2: Login route /api/auth/login
router.post('/login',login);

//Route 3:Set Avatar Route /api/auth/setavatar/:id
router.post('/setavatar/:id',setavatar);

//Route 4:Get allUser detail /api/auth/getalluser/:id
router.get('/getalluser/:id',getalluser);

export default router;