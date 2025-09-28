const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  pwd: {
    unique: true,
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
    unique: true,
    required: true,
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    index: true,
  },
});
