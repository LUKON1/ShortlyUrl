const express = require("express");
const router = express.Router();
const UrlModel = require("../models/Url");
const getShortCode = require("../utils/shortcodegen");
const jwt = require("jsonwebtoken");

router.post("/shorter", async (req, res) => {
  try {
    const { url, urlTime } = req.body;
    if (!url || !urlTime) {
      return res.status(400).json({ error: "required fields missing" });
    }
    const createdAt = new Date();
    const expiredAt = new Date(createdAt.getTime() + urlTime * 1000);

    let userId = null;
    const authHeader = req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (tokenErr) {
        return res.status(401).json({ error: "Access token invalid or expired" });
      }
    }

    let shortCode;
    let isUnique = false;
    const { customAlias } = req.body;
    const reservedRoutes = require("../../shared/clientRoutes.json");
    const RESERVED_ALIASES = Object.values(reservedRoutes).map((route) =>
      route.startsWith("/") ? route.slice(1) : route
    );
    RESERVED_ALIASES.push("api", "assets", "public");

    if (customAlias) {
      if (!/^[a-zA-Z0-9-_]+$/.test(customAlias)) {
        return res
          .status(400)
          .json({ error: "Alias can only contain letters, numbers, hyphens, and underscores." });
      }
      if (customAlias.length < 4 || customAlias.length > 30) {
        return res.status(400).json({ error: "Alias must be between 4 and 30 characters." });
      }
      if (RESERVED_ALIASES.includes(customAlias)) {
        return res.status(400).json({ error: "This alias is reserved." });
      }

      const existingUrl = await UrlModel.findOne({ shortCode: customAlias });
      if (existingUrl) {
        return res.status(409).json({ error: "Alias already taken." });
      }
      shortCode = customAlias;
      isUnique = true;
    } else {
      let attempts = 0;
      const maxAttempts = 10;

      while (!isUnique && attempts < maxAttempts) {
        attempts++;
        shortCode = getShortCode(7);
        const existingUrl = await UrlModel.findOne({ shortCode });
        if (!existingUrl) {
          isUnique = true;
        }
      }

      if (!isUnique) {
        return res.status(500).json({ error: "Failed to generate unique code, please try again." });
      }
    }

    const newUrl = new UrlModel({
      url: url,
      shortCode: shortCode,
      userId: userId,
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
