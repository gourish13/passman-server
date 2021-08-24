const mongoose = require('mongoose');

const userServicesSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
    },
    email: { 
        type: String,
        required: true,
        unique: true,
    },
    password: { 
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    services: [{
        sname: { 
            type: String,
            required: true,
        },
        spassword: { 
            type: String,
            required: true,
        }
    }]
}, { timestamps: true });

const UserServices = mongoose.model('UserServices', userServicesSchema);

module.exports = UserServices;
