const PlasticUpload = require("../models/PlasticUpload");
const User = require("../models/User");

// Calculate coupons based on weight (1 kg = 10 coupons)
const calculateCoupons = (weightInKg) => {
  return Math.round(parseFloat(weightInKg) * 10);
};

// Upload plastic waste
const uploadPlastic = async (req, res) => {
  try {
    const { weightInKg, location } = req.body;
    const userId = req.user.userId;
    const imagePath = req.file ? req.file.path : "";

    const newUpload = new PlasticUpload({
      userId,
      weightInKg: parseFloat(weightInKg),
      location,
      imagePath,
      status: "Pending"
    });

    await newUpload.save();
    res.status(201).json({
      message: "Upload successful",
      data: newUpload,
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get uploads for the logged-in user
const getUserUploads = async (req, res) => {
  try {
    const userId = req.user.userId;
    const uploads = await PlasticUpload.find({ userId }).sort({ createdAt: -1 });
    res.json(uploads);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch uploads" });
  }
};

// Get all uploads (Admin only)
const getAllUploads = async (req, res) => {
  try {
    const uploads = await PlasticUpload.find().populate("userId", "name email").sort({ createdAt: -1 });
    res.status(200).json(uploads);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch uploads" });
  }
};

// Update pickup details (Admin/Driver)
// When status is 'pickedUp', calculate and award coupons to the user
const updatePickupDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { pickupDate, pickupTime, status } = req.body;

    let updateData = { pickupDate, pickupTime, status };

    if (status === 'pickedUp') {
      const upload = await PlasticUpload.findById(id);
      if (upload) {
        const coupons = calculateCoupons(upload.weightInKg);
        updateData.couponsAwarded = coupons;

        // Credit coupons to user's account
        await User.findByIdAndUpdate(upload.userId, {
          $inc: { coupons: coupons }
        });
      }
    }

    const updated = await PlasticUpload.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error("Pickup update error:", error);
    res.status(500).json({ error: "Failed to update pickup details" });
  }
};

// Approve or reject an upload (Admin)
const approveOrRejectUpload = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, adminComment } = req.body;

    let newStatus = "";
    if (action === "approve") {
      newStatus = "Approved";
    } else if (action === "reject") {
      newStatus = "Rejected";
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    const updated = await PlasticUpload.findByIdAndUpdate(
      id,
      { status: newStatus, adminComment: adminComment || "" },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
};

// Get user stats for homepage
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const uploads = await PlasticUpload.find({ userId }).sort({ createdAt: -1 });
    const user = await User.findById(userId);

    const totalUploads = uploads.length;
    const totalWeight = uploads.reduce((acc, curr) => {
      const weight = parseFloat(curr.weightInKg);
      return acc + (isNaN(weight) ? 0 : weight);
    }, 0);

    res.json({
      totalUploads,
      totalWeight,
      couponsBalance: user ? user.coupons : 0,
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

// Get admin dashboard stats (real data)
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalUploads = await PlasticUpload.countDocuments();
    const pendingUploads = await PlasticUpload.countDocuments({ status: "Pending" });
    const approvedUploads = await PlasticUpload.countDocuments({ status: "Approved" });
    const completedPickups = await PlasticUpload.countDocuments({ status: "pickedUp" });
    const rejectedUploads = await PlasticUpload.countDocuments({ status: "Rejected" });

    // Recent uploads for activity log
    const recentUploads = await PlasticUpload.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalUploads,
      pendingUploads,
      approvedUploads,
      completedPickups,
      rejectedUploads,
      recentUploads,
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
};

module.exports = {
  uploadPlastic,
  getUserUploads,
  getAllUploads,
  updatePickupDetails,
  approveOrRejectUpload,
  getUserStats,
  getAdminStats
};
