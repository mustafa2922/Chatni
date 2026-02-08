import User from "../models/User.model.js";
import bcrypt from 'bcryptjs';
import { generateToken } from "../lib/utils.js";
import { sendEmail } from "../email/emailHandlers.js";
import cloudinary from "../lib/cloudinary.js";

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// SignUp controller
export const signup = async (req, res) => {

    const { fullName, email, password } = req.body;

    try {

        if (!fullName || !email || !password) {
            return res.status(400).json({ mesage: 'All fields are required!' })
        };

        if (password.length < 6) {
            return res.status(400).json({ mesage: 'Password must be at least 6 characters' })
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email' })
        }

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'Email already exists' })

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if (newUser) {

            const savedUser = await newUser.save();
            generateToken(savedUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullName,
                email: newUser.email,
                profileImg: newUser.profileImg
            })

            try {
                await sendEmail(savedUser.email, savedUser.fullName);
            } catch (err) {
                console.log('Error sending in email', err);
            }
        }

        else {
            return res.status(400).json({ message: 'Invalid user data' })
        }

    }
    catch (error) {
        console.log('Error in signup controller:', error);
        res.status(500).json({ message: 'Internal server error' })
    }
};

// Login controller
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({message:'Email and password are required'});
    }

    try {

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' })

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' })

        generateToken(user._id, res);

        res.status(201).json({
            _id: user._id,
            fullname: user.fullName,
            email: user.email,
            profileImg: user.profileImg
        });

    } catch (err) {

        console.log('Error in login controller: ', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Logout controller
export const logout = (_, res) => {
    res.cookie('jwt',"",{maxAge:0});
    res.status(200).json({message:'Logged out successfuly'});
};

// updateProfile controller
export const updateProfile = async (req,res) => {
    try{

        const {profileImg} = req.body;
        if (!profileImg) return res.status(400).json({message:'Profile image is required'});

        const userId = req.user._id;

        const uploadResponse = await cloudinary.uploader.upload(profileImg);

        const updatedUser = await User.findByIdAndUpdate(userId,{profileImg:uploadResponse.secure_url},{new:true});

        res.status(200).json(updatedUser);


    }catch(err){
        console.log('Error in update profile',err);
        res.status(500).json({message:'Internal server error'});
    }
};