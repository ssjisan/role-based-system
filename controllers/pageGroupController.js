const PageGroup = require("../models/pageGroupModel.js");

// ====================================
// Create a new page group
// ====================================

const createPageGroup = async (req, res) => {
  try {
    const { name, order, iconName } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Group name is required",
      });
    }

    const existingGroup = await PageGroup.findOne({ name });
    if (existingGroup) {
      return res.status(409).json({
        success: false,
        message: "Group already exists",
      });
    }

    const group = await PageGroup.create({
      name: name.trim(),
      iconName: iconName?.trim() || null, // ✅ added
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

/**
 * Get all page groups
 */
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

const deletePageGroup = async (req, res) => {
  try {
    const { id } = req.params;

    // Find page by id
    const page = await PageGroup.findById(id);
    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    // Delete page
    await PageGroup.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Page deleted successfully",
    });
  } catch (error) {
    console.error("Delete page error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPageGroup,
  getAllPageGroups,
  deletePageGroup,
};
