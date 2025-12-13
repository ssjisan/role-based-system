const PageGroup = require("../models/pageGroupModel.js");

/**
 * Create a new page group
 */
const createPageGroup = async (req, res) => {
  try {
    const { name, order } = req.body;

    // 1️⃣ Basic validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Group name is required",
      });
    }

    // 2️⃣ Check duplicate group
    const existingGroup = await PageGroup.findOne({ name });
    if (existingGroup) {
      return res.status(409).json({
        success: false,
        message: "Group already exists",
      });
    }

    // 3️⃣ Create group
    const group = await PageGroup.create({
      name,
      order: order ?? 0,
    });

    return res.status(201).json({
      success: true,
      message: "Page group created successfully",
      group,
    });
  } catch (error) {
    console.error("Create page group error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create page group",
    });
  }
};

const getAllPageGroups = async (req, res) => {
  try {
    const groups = await PageGroup.find().sort({ order: 1, createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: groups.length,
      groups,
    });
  } catch (error) {
    console.error("Get page groups error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch page groups",
    });
  }
};
module.exports = {
  createPageGroup,
  getAllPageGroups,
};
