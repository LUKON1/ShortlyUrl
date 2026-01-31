const express = require("express");
const router = express.Router();
const UrlModel = require("../models/Url");

const requestIp = require("request-ip");
const geoip = require("geoip-lite");
const UAParser = require("ua-parser-js");
const ClickModel = require("../models/Click");

router.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;

    if (shortCode.length !== 7) {
      return res.status(404).send("Not found");
    }

    // Bot Detection
    const userAgent = req.headers["user-agent"] || "";
    const isBot = /bot|crawl|spider|slurp|facebookexternalhit/i.test(userAgent);

    let urlEntry;

    if (isBot) {
      // Check existence but DO NOT increment clicks
      urlEntry = await UrlModel.findOne({ shortCode });
    } else {
      // Increment clicks for real users
      urlEntry = await UrlModel.findOneAndUpdate(
        { shortCode },
        { $inc: { clicks: 1 } },
        { new: true }
      );
    }

    if (!urlEntry) {
      return res.status(404).send("Short URL not found.");
    }

    // Fire-and-forget analytics logging (Only for humans)
    // Runs BEFORE redirecting to /pau or /exp so clicks are counted in analytics
    if (!isBot) {
      (async () => {
        try {
          const ip = requestIp.getClientIp(req);
          const geo = geoip.lookup(ip) || {};
          const ua = UAParser(userAgent);
          const referrer = req.headers["referer"] || "Direct";

          // Simplify referrer
          let simplifiedReferrer = "Direct";
          if (referrer !== "Direct") {
            try {
              const refUrl = new URL(referrer);
              simplifiedReferrer = refUrl.hostname;
            } catch (e) {
              simplifiedReferrer = referrer;
            }
          } else {
            // Check for Social Apps in User-Agent if Referer is missing
            if (/Telegram/i.test(userAgent)) simplifiedReferrer = "Telegram";
            else if (/Discord/i.test(userAgent)) simplifiedReferrer = "Discord";
            else if (/Instagram/i.test(userAgent)) simplifiedReferrer = "Instagram";
            else if (/Snapchat/i.test(userAgent)) simplifiedReferrer = "Snapchat";
            else if (/LinkedIn/i.test(userAgent)) simplifiedReferrer = "LinkedIn";
            else if (/WhatsApp/i.test(userAgent)) simplifiedReferrer = "WhatsApp";
          }

          const newClick = new ClickModel({
            urlId: urlEntry._id,
            ip: ip,
            country: geo.country || "Unknown",
            city: geo.city || "Unknown",
            deviceType: ua.device.type || "desktop", // default to desktop if undefined
            browser: ua.browser.name || "Unknown",
            os: ua.os.name || "Unknown",
            referrer: simplifiedReferrer,
          });

          await newClick.save();
        } catch (logErr) {
          console.error("Analytics logging failed:", logErr);
        }
      })();
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
