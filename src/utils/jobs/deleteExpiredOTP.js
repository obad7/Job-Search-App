import cron from "node-cron";
import OTPModel from "../../DB/Models/OTP.model.js";

// Function to delete expired OTPs
const deleteExpiredOTPs = async () => {
    try {
        const result = await OTPModel.deleteMany({
            // Delete OTPs older than 10 minutes
            createdAt: { $lt: new Date(Date.now() - 10 * 60 * 1000) },
        });
    } catch (error) {
        console.error("Error deleting expired OTPs:", error);
    }
};

// Schedule the job to run every 6 hours
cron.schedule("* */6 * * *", async () => {
    console.log(`[${new Date().toISOString()}] Running OTP cleanup job...`);
    await deleteExpiredOTPs();
});

export { deleteExpiredOTPs };