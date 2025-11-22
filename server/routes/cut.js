const express = require("express");
const router = express.Router();
const UrlModel = require("../models/Url");
const getShortCode = require("../utils/shortcodegen");
const jwt = require("jsonwebtoken");
const qrcode = require("qrcode");

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
    let isUnicue = false;
    while (!isUnicue) {
      shortCode = getShortCode(7);
      const existingUrl = await UrlModel.findOne({ shortCode });
      if (!existingUrl) {
        isUnicue = true;
      }
    }

    const fullShortUrl = `${process.env.HOST_NAME}/${shortCode}`;
    const qrCodeDataUrl = await qrcode.toDataURL(fullShortUrl, {
      errorCorrectionLevel: "M",
      type: "image/png",
      width: 256,
      color: {
        dark: "#101828",
        light: "#ffffff",
      },
    });
    const newUrl = new UrlModel({
      url: url,
      shortCode: shortCode,
      userId: userId,
      createdAt: createdAt,
      expiredAt: expiredAt,
      clicks: 0,
      qrCodeDataUrl: qrCodeDataUrl,
    });
    await newUrl.save();

    res.status(201).json({ shortCode: newUrl.shortCode, qrCodeDataUrl: newUrl.qrCodeDataUrl });
  } catch (err) {
    console.error("Error in /shorter route:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
