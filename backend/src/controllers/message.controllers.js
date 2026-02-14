import User from "../models/User.model.js";
import Message from "../models/Message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllContacts = async (req, res) => {
    try {

        const loggedInUser = req.user._id;

        const filteredUser = await User.find({ _id: { $ne: loggedInUser } }).select('-password');

        res.status(201).json(filteredUser)

    } catch (err) {
        console.log('Error in getAllContacts ', err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getChatPartners = async () => { };

export const getMessagesById = async (req, res) => {
    try {

        const userId = req.user._id;
        const { id: clickedUser } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: clickedUser },
                { senderId: clickedUser, receiverId: userId }
            ]
        });

        res.status(200).json(messages)

    } catch (err) {
        console.log('Error in getMessagesById ', err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {

        const senderId = req.user._id;
        const { id: receiverId } = req.params;
        const { text, image } = req.body;

        let imageUrl;

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        res.status(201).json(newMessage);

    } catch (err) {
        console.log('Error in sendMessage ', err);
        res.status(500).json({ message: "Internal server error" });
    }
};