const { compare } = require('bcrypt');
const User = require('../models/services');


// Master Password Matching Middleware
const matchPassword = (req, res, next) => {
    if (!req.body.password)
        res.status(403).json({status: 'Master Password Required'});
    else
        User.findById(req.user.id, 'password', (err, user) => {
            if (err)
                res.status(500).json({status: 'Internal Server Error'});
            else 
                compare(req.body.password, user.password, (err, result) => {
                    if (err)
                        res.status(500).json({status: 'Internal Server Error'});
                    else if (result === false)
                        res.status(403).json({status: 'Wrong Master Password'});
                    else
                        next();
                });
        });
};


// Requesting a Password Service 
const getService = (req, res) => {
    User.findOne({ 
                _id: req.user.id, 
                "services": {$elemMatch: {sname: req.body.sname}} 
        },
        "password services",
        function (err, user) {
        if (err)
            res.status(500).json({status: 'Internal Server Error'});
        else if (!user)
            res.status(200).json({ status: null })
        else {
            compare(req.body.password, user.password, (err, result) => {
                if (err)
                    res.status(500).json({status: 'Internal Server Error'});
                else if (result === false)
                    res.status(403).json({status: 'Wrong Master Password'});
                else {
                    user.services = user.services
                        .find( service => service.sname == req.body.sname );
                    res.status(200).json({ servicePassword: user.services[0].spassword });
                }
            });
        }
    });
};

// Add a Password Service
const addService = (req, res) => {
    const sname = req.body.sname;
    const spassword = req.body.spassword;
    if (!sname || !spassword)
            res.status(400).json({status: 'Service name and password required for adding service'});
    else
        User.findOneAndUpdate({_id: req.user.id, "services.sname": { $ne: sname }}, 
            {$push: {services: {sname: sname, spassword: spassword}}}, 
            function (err, doc) {
                if (err)
                    res.status(500).json({status: 'Internal Server Error'});
                else if (!doc)
                    res.status(200).json({ status: null });
                else
                    res.status(200).json({status: 'Service Password Succesfully and Securely Stored'})
            });
};

// Update a Passsword Service
const updateService = (req, res) => {
    const sname = req.body.sname;
    const spassword = req.body.spassword;
    if (!sname || !spassword)
            res.status(400).json({status: 'Service name and password required for updating service'});
    else
        User.findOneAndUpdate({ _id: req.user.id, "services.sname": sname },
            {$set: { "services.$.spassword": spassword }},
            function (err, doc) {
                if (err)
                    res.status(500).json({status: 'Internal Server Error'});
                else if (!doc)
                    res.status(200).json({ status: null });
                else
                    res.status(200).json({status: 'Service Password Succesfully and Securely Updated'})
            });
};

// Delete a Passsword Service
const deleteService = (req, res) => {
    const sname = req.body.sname;
    if (!sname)
            res.status(400).json({status: 'Service name required for deleting service'});
    else
        User.findOneAndUpdate({ _id: req.user.id, "services.sname": sname }, 
            {$pull: { services: { sname: sname } }},
            function (err, doc) {
                if (err)
                    res.status(500).json({status: 'Internal Server Error'});
                else if (!doc)
                    res.status(200).json({ status: null });
                else
                    res.status(200).json({status: 'Service Password Succesfully Deleted without leaving a trace'});
            });
};

module.exports = {
    matchPassword,
    getService,
    addService,
    updateService,
    deleteService
}
