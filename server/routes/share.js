const express = require("express");
const router = express.Router();
const UrlModel = require("../models/Url");

router.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;

    const urlEntry = await UrlModel.findOne({ shortCode });

    if (!urlEntry) {
      return res.status(404).json({ error: "Short URL not found." });
    }

    // Generate daily analytics data (same logic as in myurls.js)
    const now = new Date();
    const createdDate = new Date(urlEntry.createdAt);
    const daysSinceCreation = Math.ceil((now - createdDate) / (1000 * 60 * 60 * 24));
    const daysToShow = Math.min(daysSinceCreation, 30);

    const chartData = [];
    const totalClicks = urlEntry.clicks;
    const avgClicksPerDay = daysToShow > 0 ? totalClicks / daysToShow : 0;

    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = date.toISOString().split("T")[0];

      // Distribute clicks with randomization
      const baseClicks = Math.floor(avgClicksPerDay);
      const variance = Math.floor(Math.random() * Math.max(1, baseClicks * 0.5));
      const clicks =
        i === 0
          ? Math.max(0, totalClicks - chartData.reduce((sum, d) => sum + d.clicks, 0))
          : Math.max(0, baseClicks + (Math.random() > 0.5 ? variance : -variance));

      chartData.push({
        date: dateKey,
        clicks: clicks,
      });
    }

    // Adjust to match total clicks
    const distributedTotal = chartData.reduce((sum, d) => sum + d.clicks, 0);
    if (distributedTotal !== totalClicks && chartData.length > 0) {
      chartData[chartData.length - 1].clicks += totalClicks - distributedTotal;
    }

    const publicData = {
      url: urlEntry.url,
      shortCode: urlEntry.shortCode,
      createdAt: urlEntry.createdAt,
      expiredAt: urlEntry.expiredAt,
      clicks: urlEntry.clicks,
      qrCodeDataUrl: urlEntry.qrCodeDataUrl,
      isExpired: new Date(urlEntry.expiredAt) < new Date(),
      chartData: chartData,
    };

    res.status(200).json(publicData);
  } catch (err) {
    console.error("Error in /share/:shortCode route:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
