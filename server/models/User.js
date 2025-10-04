const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	pwd: {
		required: true,
		type: String,
		minlength: 5,
	},
	user: {
		unique: true,
		required: true,
		type: String,
		minlength: 4,
		maxlength: 15,
	},
	refreshToken: {
		type: String,
	},
});
const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
