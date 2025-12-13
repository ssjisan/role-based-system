const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  order: {
    type: Number,
    default: 0,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PageGroup",
    default: null,
  },
  availableActions: [
    {
      type: String,
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Page = mongoose.model("Page", pageSchema);

module.exports = Page;
