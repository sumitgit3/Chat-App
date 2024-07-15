import express from 'express'
import {addmessage,getallmessage} from '../controllers/messageController.js'
const router = express.Router();

//route 1:api/message/addmessage
router.post('/addmessage',addmessage);

//route 2: api/message/getallmessage
router.post('/getallmessage',getallmessage);

export default router;