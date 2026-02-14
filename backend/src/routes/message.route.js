import express from 'express';
import { getAllContacts, getChatPartners, getMessagesById, sendMessage } from '../controllers/message.controllers.js'
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protectRoute);

router.get('/contacts', getAllContacts );   
router.get('/chats', getChatPartners);
router.get('/:id', getMessagesById);

router.post('/send/:id', sendMessage);

export default router;