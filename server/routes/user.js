const express = require("express");
require("dotenv").config();
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const { route } = require("./myurls");

router.post("/register", async (req, res) => {
	try {
		const { pwd, user } = req.body;
		if (!pwd || !user) {
			return res.status(400).json({ error: "required fields missing" });
		}
		const existingUser = await UserModel.findOne({ user: user });
		if (existingUser) {
			return res.status(409).json({ error: "Username already exists" });
		}
		const hashedPwd = await bcrypt.hash(pwd, 10);

		const newUser = new UserModel({
			user: user,
			pwd: hashedPwd,
		});

		await newUser.save();

		const accessToken = jwt.sign(
			{ userId: newUser._id, user: newUser.user },
			process.env.JWT_SECRET,
			{ expiresIn: "30m" }
		);

		const refreshToken = jwt.sign(
			{ userId: newUser._id },
			process.env.JWT_REFRESH_SECRET,
			{ expiresIn: "7d" }
		);

		newUser.refreshToken = refreshToken;
		await newUser.save();

		res.cookie("jwt", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.status(201).json({ accessToken: accessToken, userId: newUser._id });
	} catch (err) {
		console.error("Error in /registr route:", err);
		res.status(500).json({ error: "Server error", details: err.message });
	}
});

router.post("/login", async (req, res) => {
	try {
		const { user, pwd } = req.body;
		if (!user || !pwd) {
			return res
				.status(400)
				.json({ error: "Username and password are required" });
		}

		const foundUser = await UserModel.findOne({ user: user });
		if (!foundUser) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		const match = await bcrypt.compare(pwd, foundUser.pwd);
		if (!match) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		const accessToken = jwt.sign(
			{ userId: foundUser._id, user: foundUser.user },
			process.env.JWT_SECRET,
			{ expiresIn: "30m" }
		);

		const newRefreshToken = jwt.sign(
			{ userId: foundUser._id },
			process.env.JWT_REFRESH_SECRET,
			{ expiresIn: "7d" }
		);

		foundUser.refreshToken = newRefreshToken;
		await foundUser.save();

		res.cookie("jwt", newRefreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.status(200).json({
			accessToken: accessToken,
			userId: foundUser._id,
		});
	} catch (err) {
		console.error("Error in /login route:", err);
		res.status(500).json({ error: "Server error", details: err.message });
	}
});

router.post("/refresh", async (req, res) => {
	try {
		const cookies = req.cookies;
		if (!cookies) {
			res.status(401).json({
				error: "Unautorized: Refresh token not found",
			});
		}
		const refreshToken = cookies.jwt;
		const foundUser = await UserModel.findOne({
			refreshToken: refreshToken,
		});
		if (!foundUser) {
			res.clearCookie("jwt", {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
			});
			return res
				.status(403)
				.json({ error: "Forbidden: Invalid or revoked refresh token" });
		}
		jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_SECRET,
			async (err, decoded) => {
				if (err) {
					res.clearCookie("jwt", {
						httpOnly: true,
						secure: process.env.NODE_ENV === "production",
						sameSite: "strict",
					});
					return res
						.status(403)
						.json({
							error: "Forbidden: Refresh token expired or invalid",
						});
				}

				if (foundUser._id.toString() !== decoded.userId) {
					res.clearCookie("jwt", {
						httpOnly: true,
						secure: process.env.NODE_ENV === "production",
						sameSite: "strict",
					});
					return res
						.status(403)
						.json({ error: "Forbidden: User ID mismatch" });
				}

				const newAccessToken = jwt.sign(
					{ userId: foundUser._id, user: foundUser.user },
					process.env.JWT_SECRET,
					{ expiresIn: "30m" }
				);

				const newRefreshToken = jwt.sign(
					{ userId: foundUser._id },
					process.env.JWT_REFRESH_SECRET,
					{ expiresIn: "7d" }
				);

				foundUser.refreshToken = newRefreshToken;
				await foundUser.save();

				res.cookie("jwt", newRefreshToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "strict",
					maxAge: 7 * 24 * 60 * 60 * 1000,
				});

				res.status(200).json({
					accessToken: newAccessToken,
					userId: foundUser._id,
				});
			}
		);
	} catch (err) {
		console.error("Error in /refresh route:", err);
		res.status(500).json({ error: "Server error", details: err.message });
	}
});

router.post("/logout", async (req, res) => {
	try {
		const cookies = req.cookies;

		if (!cookies?.jwt) {
			return res.sendStatus(204);
		}

		const refreshToken = cookies.jwt;

		const foundUser = await UserModel.findOne({
			refreshToken: refreshToken,
		});
		if (!foundUser) {
			res.clearCookie("jwt", {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
			});
			return res.sendStatus(204);
		}

		foundUser.refreshToken = null;
		await foundUser.save();

		res.clearCookie("jwt", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		});

		res.sendStatus(204);
	} catch (err) {
		console.error("Error in /logout route:", err);
		res.status(500).json({ error: "Server error", details: err.message });
	}
});

module.exports = router;
