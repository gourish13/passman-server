const mongoose = require("mongoose");

const userServicesSchema = new mongoose.Schema(
  {
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
    role: {
      type: String,
      required: true,
      default: "user",
    },
    ckey: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    services: [
      {
        sname: {
          type: String,
          required: true,
          unique: true,
        },
        spassword: {
          type: String,
          required: true,
        },
        modifiedAt: {
          type: Date,
          required: true,
          default: () => new Date(),
        },
      },
    ],
  },
  { timestamps: true }
);

const UserServices = mongoose.model("UserServices", userServicesSchema);

module.exports = UserServices;
