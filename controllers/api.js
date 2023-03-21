const { compare } = require("bcrypt");
const User = require("../models/services");
const { encrypted, decrypted } = require("../utils/aes");

// Master Password Matching Middleware
const matchPassword = (req, res, next) => {
  if (!req.body.password)
    res.status(403).json({ status: "Master Password Required" });
  else
    User.findById(req.user.id, "password ckey", (err, user) => {
      if (err) res.status(500).json({ status: "Internal Server Error" });
      else {
        let password = decrypted(req.body.password, user.ckey);
        req.user.ckey = user.ckey;

        // Compare decrypted password with hashed password in db
        compare(password, user.password, (err, result) => {
          if (err) res.status(500).json({ status: "Internal Server Error" });
          else if (result === false)
            res.status(403).json({ status: "Wrong Master Password" });
          else next();
        });
      }
    });
};

// Requesting Client Key
const getClientKey = (req, res) => {
  User.findOne({ _id: req.user.id }, "ckey", function (err, user) {
    if (err) res.status(500).json({ status: "Internal Server Error" });
    else if (!user) res.status(200).json({ key: null });
    else res.status(200).json({ key: user.ckey });
  });
};

// equesting names of all services
const getAllServices = (req, res) => {
  User.findOne({ _id: req.user.id }, "services", function (err, user) {
    if (err) res.status(500).json({ status: "Internal Server Error" });
    else if (!user) res.status(200).json({ services: [] });
    else res.status(200).json({ services: user.services });
  });
};

// Requesting a Password Service
const getService = (req, res) => {
  User.findOne(
    {
      _id: req.user.id,
      services: { $elemMatch: { sname: req.body.sname } },
    },
    "password services",
    function (err, user) {
      if (err) res.status(500).json({ status: "Internal Server Error" });
      else if (!user) res.status(200).json({ status: null });
      else {
        user.services = user.services.find(
          (service) => service.sname == req.body.sname
        );
        res.status(200).json({
          servicePassword: encrypted(
            decrypted(user.services[0].spassword),
            req.user.ckey
          ),
        });
      }
    }
  );
};

// Add a Password Service
const addService = (req, res) => {
  if (!req.user.sname || !req.user.spassword)
    res.status(400).json({
      status: "Service name and password required for adding service",
    });
  else {
    const sname = req.body.sname;
    const spassword = encrypted(decrypted(req.body.spassword, req.user.ckey));

    User.findOneAndUpdate(
      { _id: req.user.id, "services.sname": { $ne: sname } },
      { $push: { services: { sname: sname, spassword: spassword } } },
      function (err, doc) {
        if (err) res.status(500).json({ status: "Internal Server Error" });
        else if (!doc) res.status(200).json({ status: null });
        else
          res.status(200).json({
            status: "Service Password Succesfully and Securely Stored",
          });
      }
    );
  }
};

// Update a Passsword Service
const updateService = (req, res) => {
  if (!req.user.sname || !req.user.spassword)
    res.status(400).json({
      status: "Service name and password required for updating service",
    });
  else {
    const sname = req.body.sname;
    const spassword = encrypted(decrypted(req.body.spassword, req.user.ckey));

    User.findOneAndUpdate(
      { _id: req.user.id, "services.sname": sname },
      { $set: { "services.$.spassword": spassword } },
      function (err, doc) {
        if (err) res.status(500).json({ status: "Internal Server Error" });
        else if (!doc) res.status(200).json({ status: null });
        else
          res.status(200).json({
            status: "Service Password Succesfully and Securely Updated",
          });
      }
    );
  }
};

// Delete a Passsword Service
const deleteService = (req, res) => {
  const sname = req.body.sname;
  if (!sname)
    res
      .status(400)
      .json({ status: "Service name required for deleting service" });
  else
    User.findOneAndUpdate(
      { _id: req.user.id, "services.sname": sname },
      { $pull: { services: { sname: sname } } },
      function (err, doc) {
        if (err) res.status(500).json({ status: "Internal Server Error" });
        else if (!doc) res.status(200).json({ status: null });
        else
          res.status(200).json({
            status:
              "Service Password Succesfully Deleted without leaving a trace",
          });
      }
    );
};

// Exports
module.exports = {
  matchPassword,
  getClientKey,
  getAllServices,
  getService,
  addService,
  updateService,
  deleteService,
};
