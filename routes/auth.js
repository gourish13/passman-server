const express = require('express');
const router = express.Router();
const { verifyToken } = require('../utils/tokens');
const { 
    signup,
    verify,
    isSignedUp,
    login,
    resetPassword,
    forgotPassword,
    deleteUser
} = require('../controllers/auth');


router.get('/signed-up', isSignedUp);

router.post('/signup', signup);

router.post('/login', login);

router.patch('/verify', verifyToken, verify);

router.get('/forgot-password', forgotPassword);

router.patch('/reset-password', verifyToken, resetPassword);

router.delete('/delete-user', verifyToken, deleteUser);

module.exports = router;
