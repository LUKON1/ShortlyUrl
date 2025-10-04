const express = require("express");
const router = express.Router();
const UrlModel = require("../models/Url");
const getShortCode = require("../utils/shortcodegen");

router.post("/shorter", async (req, res) => {
	try {
		const { url, urlTime, userId } = req.body;
		if (!url || !urlTime) {
			return res.status(400).json({ error: "required fields missing" });
		}
		const createdAt = new Date();
		const expiredAt = new Date(createdAt.getTime() + urlTime * 1000);

		let shortCode;
		let isUnicue = false;
		while (!isUnicue) {
			shortCode = getShortCode(7);
			const existingUrl = await UrlModel.findOne({ shortCode });
			if (!existingUrl) {
				isUnicue = true;
			}
		}

		const newUrl = new UrlModel({
			url: url,
			shortCode: shortCode,
			userId: userId || null,
			createdAt: createdAt,
			expiredAt: expiredAt,
			clicks: 0,
		});
		await newUrl.save();

		res.status(201).json({ shortCode: newUrl.shortCode });
	} catch (err) {
		console.error("Error in /shorter route:", err);
		res.status(500).json({ error: "Server error", details: err.message });
	}
});

module.exports = router;
