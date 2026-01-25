const cron = require("node-cron");
const UrlModel = require("../models/Url");
const ClickModel = require("../models/Click");
const DailyStatsModel = require("../models/DailyStats");

// Run at 04:00 AM every day
const startCleanupJob = () => {
  cron.schedule("0 4 * * *", async () => {
    console.log("Running expired URLs cleanup...");

    try {
      // 1. Calculate threshold date (30 days ago)
      const now = new Date();
      const thresholdDate = new Date(now.setDate(now.getDate() - 30));

      // 2. Find URLs that expired before the threshold
      const expiredUrls = await UrlModel.find({
        expiredAt: { $lt: thresholdDate },
      });

      if (expiredUrls.length === 0) {
        console.log("No old expired URLs found to delete.");
        return;
      }

      console.log(`Found ${expiredUrls.length} expired URLs to delete.`);

      const urlIds = expiredUrls.map((url) => url._id);

      // 3. Delete related data (Cascade Delete)
      // Delete DailyStats
      const statsDeleteResult = await DailyStatsModel.deleteMany({
        urlId: { $in: urlIds },
      });

      // Delete Raw Clicks (if any left)
      const clicksDeleteResult = await ClickModel.deleteMany({
        urlId: { $in: urlIds },
      });

      // 4. Delete the URLs themselves
      const urlsDeleteResult = await UrlModel.deleteMany({
        _id: { $in: urlIds },
      });

      console.log(
        `Cleanup complete. Deleted: ${urlsDeleteResult.deletedCount} URLs, ${statsDeleteResult.deletedCount} DailyStats, ${clicksDeleteResult.deletedCount} Clicks.`
      );
    } catch (err) {
      console.error("Error during expired URLs cleanup:", err);
    }
  });
};

module.exports = startCleanupJob;
