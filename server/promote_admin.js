const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const promoteUser = async (email) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`User with email ${email} not found.`);
            return;
        }

        user.role = 'admin';
        await user.save();
        console.log(`Successfully promoted ${user.name} (${user.email}) to Admin.`);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
    }
};

// Get email from command line argument
const emailArg = process.argv[2];

if (!emailArg) {
    console.log("Usage: node promote_admin.js <email>");
    process.exit(1);
}

promoteUser(emailArg);
