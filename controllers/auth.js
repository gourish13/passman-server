const { genSalt, hash, compare } = require('bcrypt');
const User = require('../models/services');
const { signToken } = require('../utils/tokens'); 
const mailer = require('../utils/mailer');

// Initiate User Registration
const signup = (req, res) => {
    const saltRounds = 10;
    genSalt(saltRounds, (err, salt) => {
        if (err) 
            res.status(500).json({status: 'Internal Server Error'});
        else
            hash(req.body.password, salt, (err, hashedPassword) => {
                if (err) 
                    res.status(500).json({status: 'Internal Server Error'});
                else 
                    new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: hashedPassword
                    })
                    .save( (error, user) => {
                        if (error) {
                            console.log(error);
                            res.status(500).json({status: 'Internal Server Error'});
                        } 
                        else {
                            signToken( { id: user._id }, (err, token) => {
                                if (err) {
                                    res.status(500).json({status: 'Internal Server Error'});
                                } 
                                else {
                                    mailer.sendEmail(user.email, mailer.MAILTYPE.VERIFY, token);
                                    res.status(200).json({ status: 'Email sent for verification' });
                                    // res.status(200).json({ Authorization: token });
                                }
                            });
                        }
                    });
            });
    });
};

// Verify Registering User
const verify = (req, res) => {
    User.findByIdAndUpdate(req.user.id, { verified: true }, (err, doc) => {
        if (err)
            res.status(500).json({status: 'Internal Server Error'});
        else
            res.status(200).json( { verified: true } );
    });
};

// Check Already Registered User By Email-Id
const isSignedUp = (req, res) => {
    User.exists({email: req.query.email}, (err, result) => {
        if (err)
            res.status(500).json({status: 'Internal Server Error'});
        else if(!result)
            res.status(200).json({ registered: false });
        else
            User.findOneAndDelete({email: req.query.email, verified: false}, (err, doc) => {
                if (err)
                    res.status(500).json({status: 'Internal Server Error'});
                else if (!doc)
                    res.status(200).json({ registered: true });
                else
                    res.status(200).json({ registered: false });
            });
    });
};

// Login User By Email-Id And Password
const login = (req, res) => {
    User.findOne({email: req.body.email, verified: true}, '_id password services.sname', (err, user) => {
        if (err)
            res.status(500).json({status: 'Internal Server Error'});
        else if (user === null)
            res.status(401).json({status: 'User account not registered, please signup'});
        else 
            compare(req.body.password, user.password, (err, result) => {
                if (err)
                    res.status(500).json({status: 'Internal Server Error'});
                else if (!result)
                    res.status(403).json({status: 'Wrong Email or Password'});
                else {
                    signToken( { id: user._id }, (err, token) => {
                        if (err)
                            res.status(500).json({status: 'Internal Server Error'});
                        else 
                            res.status(200).json({ Authorization: token, services: user.services });
                    });
                }
            });
    });
};

// Forgot Password
const forgotPassword = (req, res) => {
    User.findOne({ email: req.query.email }, '_id', (err, user) => {
        if (err)
            res.status(500).json({status: 'Internal Server Error'});
        else
            signToken( { id: user._id }, (err, token) => {
                if (err)
                    res.status(500).json({status: 'Internal Server Error'});
                else {
                    mailer.sendEmail(req.query.email, mailer.MAILTYPE.RESETPASS, token);
                    res.status(200).json({ status: 'Email sent for resetting password' });
                }
            });
    });
};

// Reset Password
const resetPassword = (req, res) => {
    const saltRounds = 10;
    genSalt(saltRounds, (err, salt) => {
        if (err) 
            res.status(500).json({status: 'Internal Server Error'});
        else
            hash(req.body.password, salt, (err, password) => {
                if (err) 
                    res.status(500).json({status: 'Internal Server Error'});
                else 
                    User.findByIdAndUpdate(req.user.id, { password: password }, (err, doc) => {
                        if (err)
                            res.status(500).json({status: 'Internal Server Error'});
                        else
                            res.status(200).json( { passwordUpdated: true } );
                    });
            });
    });
};

// Delete User By Id
const deleteUser = (req, res) => {
    User.findByIdAndDelete(req.user.id, (err, doc) => {
        if (err)
            res.status(500).json({status: 'Internal Server Error'});
        else
            res.status(200).json( { deleted: true } );
    });
};

module.exports = { 
    signup,
    verify,
    isSignedUp,
    login,
    resetPassword,
    forgotPassword,
    deleteUser
};
