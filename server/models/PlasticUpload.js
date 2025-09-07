const mongoose = require("mongoose");

const plasticUploadSchema = new mongoose.Schema({
  username: String,
  weightInKg: Number,
  location: String,
  imagePath: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  pickupStatus: {
    type: String,
    default: "Pending",
  },
  pickupDate: String,
  pickupTime: String,
  rewardCoupon: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("PlasticUpload", plasticUploadSchema);
