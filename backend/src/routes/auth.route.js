import express from 'express';

const router = express.Router();

router.get('/signup',(req,res) => {
    res.send('Signup Called')
})

router.get('/login',(req,res) => {
    res.send('Login Called')
})

router.get('/logout',(req,res) => {
    res.send('Logout Called')
})


export default router;