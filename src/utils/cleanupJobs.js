import cron from "node-cron";
import createConnection from "@/app/lib/db";

const removeExpiredUsers = async () => {
  const db = await createConnection();

  const oneDayAgo = new Date();
  oneDayAgo.setHours(oneDayAgo.getHours() - 24);

  try {
    const result = await db.collection("user").deleteMany({
      auth: false, // Only unauthorized users
      createdAt: { $lt: oneDayAgo }, // Older than 24 hours
    });

    console.log(`${result.deletedCount} expired users removed.`);
  } catch (error) {
    console.error("Error removing expired users:", error);
  }
};

// Schedule to run every hour
cron.schedule("0 * * * *", removeExpiredUsers);

export default removeExpiredUsers;
