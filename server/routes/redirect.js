const express = require("express");
const router = express.Router();
const UrlModel = require("../models/Url");

router.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;

    if (shortCode.length !== 7) {
      return res.status(404).send("Not found");
    }

    const urlEntry = await UrlModel.findOneAndUpdate(
      { shortCode },
      { $inc: { clicks: 1 } },
      { new: true } // Return the updated document
    );

    if (!urlEntry) {
      return res.status(404).send("Short URL not found.");
    }

    if (urlEntry.isActive === false) {
      return res.redirect(302, `${process.env.HOST_NAME}/pau`);
    }

    if (new Date(urlEntry.expiredAt) < new Date()) {
      return res.redirect(302, `${process.env.HOST_NAME}/exp`);
    }

    return res.redirect(302, urlEntry.url);
  } catch (err) {
    console.error("Error during short URL redirect:", err);
    res.status(500).send("Server error during redirect.");
  }
});

module.exports = router;
