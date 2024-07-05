import express from 'express'
import  {register,login}  from '../controllers/userController.js';

const router = express.Router();

//Route 1: Register route /api/auth/register
router.post('/register',register);

//Route 2: Login route /api/auth/login
router.post('/login',login);

export default router;