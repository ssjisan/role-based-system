const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  permissions: [
    {
      page: {
        type: String,
        required: true,
      },
      actions: [
        {
          type: String,
        },
      ],
    },
  ],
  isDefault: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
