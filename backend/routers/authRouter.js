const express=require('express');
const {signUp,login,logout,refreshToken,searchUsersByName}=require('../controllers/authController');
const {authenticateUser}=require('../middlewares/authenticateUser')

const router=express.Router();

router.post('/signup',signUp);
router.post('/login',login);
router.post('/logout',logout);
router.post('/refresh-token',refreshToken);

const { getUserInfo } = require('../controllers/authController');

router.get("/user-info", authenticateUser, getUserInfo);

// New route to search users by name
router.get("/users/search", authenticateUser, searchUsersByName);

module.exports=router;
