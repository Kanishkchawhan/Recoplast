const PlasticUpload = require("../models/PlasticUpload");

const uploadPlastic = async (req, res) => {
  try {
    const { username, weightInKg, location, pickupDate, pickupTime } = req.body;
    const imagePath = req.file ? req.file.path : "";

    // Determine reward
    let rewardCoupon = null;
    if (weightInKg >= 20) {
      rewardCoupon = "₹250 Coupon";
    } else if (weightInKg >= 10) {
      rewardCoupon = "₹100 Coupon";
    } else if (weightInKg >= 5) {
      rewardCoupon = "₹50 Coupon";
    }

    const newUpload = new PlasticUpload({
      username,
      weightInKg,
      location,
      imagePath,
      pickupDate,
      pickupTime,
      rewardCoupon,
    });

    await newUpload.save();
    res.status(201).json({
    message: "Upload successful",
    data: newUpload,
    rewardCoupon: newUpload.rewardCoupon, // Include the generated coupon
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getUserUploads = async (req, res) => {
  try {
    const { username } = req.params;
    const uploads = await PlasticUpload.find({ username });
    res.json(uploads);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch uploads" });
  }
};
// Get all uploads (for Admin)
const getAllUploads = async (req, res) => {
  try {
    const uploads = await PlasticUpload.find().sort({ uploadedAt: -1 });
    res.status(200).json(uploads);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch uploads" });
  }
};

// Update pickup status, date, and time
const updatePickupDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { pickupStatus, pickupDate, pickupTime } = req.body;

    const updated = await PlasticUpload.findByIdAndUpdate(
      id,
      { pickupStatus, pickupDate, pickupTime },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update pickup details" });
  }
};

// New: Approve or reject an upload
const approveOrRejectUpload = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'approve' or 'reject'
    let update = {};
    if (action === "approve") {
      update.pickupStatus = "Approved";
    } else if (action === "reject") {
      update.pickupStatus = "Rejected";
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }
    const updated = await PlasticUpload.findByIdAndUpdate(id, update, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
};

module.exports = {
  uploadPlastic,
  getUserUploads,
  getAllUploads,
  updatePickupDetails,
  approveOrRejectUpload,
};

