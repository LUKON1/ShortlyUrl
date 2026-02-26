const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
    minlength: 4,
    maxlength: 30,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
  },
  createdAt: {
    type: Date,
    required: true,
    index: true,
  },
  expiredAt: {
    type: Date,
    required: true,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  title: {
    type: String,
    trim: true,
    maxlength: 24,
    default: null,
  },
});

const UrlModel = mongoose.model("Url", UrlSchema);

module.exports = UrlModel;
