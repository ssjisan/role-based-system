const PageGroup = require("../models/pageGroupModel");

// ====================================
// CREATE
// POST /page-groups
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

    const exists = await PageGroup.findOne({ name: name.trim() });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Group already exists",
      });
    }

    const group = await PageGroup.create({
      name: name.trim(),
      iconName: iconName?.trim() || null,
      order: order ?? 0,
    });

    res.status(201).json({
      success: true,
      message: "Page group created successfully",
      group,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create page group",
    });
  }
};

// ====================================
// GET ALL
// GET /page-groups
// ====================================
const getAllPageGroups = async (req, res) => {
  try {
    const groups = await PageGroup.find().sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: groups.length,
      groups,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch page groups",
    });
  }
};

// ====================================
// GET SINGLE
// GET /page-groups/:id
// ====================================
const getPageGroupById = async (req, res) => {
  try {
    const group = await PageGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    res.status(200).json({
      success: true,
      group,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch group",
    });
  }
};

// ====================================
// UPDATE
// PUT /page-groups/:id
// ====================================
const updatePageGroup = async (req, res) => {
  try {
    const { name, order, iconName, isActive } = req.body;

    const group = await PageGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // prevent duplicate name
    if (name) {
      const exists = await PageGroup.findOne({
        name: name.trim(),
        _id: { $ne: req.params.id },
      });

      if (exists) {
        return res.status(409).json({
          success: false,
          message: "Group name already exists",
        });
      }
    }

    group.name = name?.trim() ?? group.name;
    group.iconName = iconName?.trim() ?? group.iconName;
    group.order = order ?? group.order;
    group.isActive = isActive ?? group.isActive;

    await group.save();

    res.status(200).json({
      success: true,
      message: "Page group updated successfully",
      group,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update group",
    });
  }
};

// ====================================
// DELETE
// DELETE /page-groups/:id
// ====================================
const deletePageGroup = async (req, res) => {
  try {
    const group = await PageGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    await group.deleteOne();

    res.status(200).json({
      success: true,
      message: "Page group deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete group",
    });
  }
};

module.exports = {
  createPageGroup,
  getAllPageGroups,
  getPageGroupById,
  updatePageGroup,
  deletePageGroup,
};
