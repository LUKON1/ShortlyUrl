const express = require("express");
const router = express.Router();
const UrlModel = require("../models/Url");
const UserModel = require("../models/User");

router.get("/geturls", async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const userUrls = await UrlModel.find({ userId: userId }).sort({
            createdAt: -1,
        });

        res.status(200).json(userUrls);
    } catch (err) {
        console.error("Error in /geturls route:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

router.get("/analytics", async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const userUrls = await UrlModel.find({ userId: userId });

        const totalUrls = userUrls.length;
        const totalClicks = userUrls.reduce((sum, url) => sum + url.clicks, 0);
        const activeUrls = userUrls.filter(url => new Date(url.expiredAt) > new Date()).length;
        const expiredUrls = totalUrls - activeUrls;

        const now = new Date();
        const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const clicksLast7Days = userUrls
            .filter(url => new Date(url.createdAt) >= last7Days)
            .reduce((sum, url) => sum + url.clicks, 0);

        const clicksLast30Days = userUrls
            .filter(url => new Date(url.createdAt) >= last30Days)
            .reduce((sum, url) => sum + url.clicks, 0);

        const topUrls = userUrls
            .sort((a, b) => b.clicks - a.clicks)
            .slice(0, 5)
            .map(url => ({
                shortCode: url.shortCode,
                url: url.url,
                clicks: url.clicks,
            }));

        const urlsCreatedByDay = {};
        const clicksByDay = {};

        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dateKey = date.toISOString().split('T')[0];
            urlsCreatedByDay[dateKey] = 0;
            clicksByDay[dateKey] = 0;
        }

        userUrls.forEach(url => {
            const createdDate = new Date(url.createdAt).toISOString().split('T')[0];
            if (urlsCreatedByDay.hasOwnProperty(createdDate)) {
                urlsCreatedByDay[createdDate]++;
            }
            if (clicksByDay.hasOwnProperty(createdDate)) {
                clicksByDay[createdDate] += url.clicks;
            }
        });

        const chartData = Object.keys(urlsCreatedByDay).map(date => ({
            date: date,
            created: urlsCreatedByDay[date],
            clicks: clicksByDay[date],
        }));

        res.status(200).json({
            totalUrls,
            totalClicks,
            activeUrls,
            expiredUrls,
            clicksLast7Days,
            clicksLast30Days,
            topUrls,
            chartData,
        });
    } catch (err) {
        console.error("Error in /analytics route:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

router.get("/profile", async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const user = await UserModel.findById(userId).select('-pwd -refreshToken');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userUrls = await UrlModel.find({ userId: userId });
        const totalClicks = userUrls.reduce((sum, url) => sum + url.clicks, 0);
        const accountCreated = user._id.getTimestamp();

        res.status(200).json({
            username: user.user,
            totalUrls: userUrls.length,
            totalClicks: totalClicks,
            accountCreated: accountCreated,
        });
    } catch (err) {
        console.error("Error in /profile route:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

module.exports = router;
