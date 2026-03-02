const mongoose = require("mongoose");

const plasticUploadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  weightInKg: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  imagePath: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "pickedUp"],
    default: "Pending",
  },
  adminComment: {
    type: String,
    default: "",
  },
  pickupDate: String,
  pickupTime: String,
  couponsAwarded: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model("PlasticUpload", plasticUploadSchema);
