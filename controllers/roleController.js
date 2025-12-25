const Role = require("../models/roleModel.js");

/**
 * Create a new role
 */
const createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    console.log(req.body);

    // Check if role exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: "Role already exists",
      });
    }

    // Create role
    const role = await Role.create({
      name,
      description,
      permissions,
    });

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all roles
 */
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();

    res.status(200).json({
      success: true,
      count: roles.length,
      roles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get single role by ID
 */
const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    res.status(200).json({
      success: true,
      role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update role
 */
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, permissions } = req.body;

    const role = await Role.findById(id);
    if (!role)
      return res
        .status(404)
        .json({ success: false, message: "Role not found" });

    // Update fields
    role.name = name;
    role.description = description;
    role.permissions = permissions;

    await role.save();
    res
      .status(200)
      .json({ success: true, message: "Role updated successfully", role });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete role
 */
const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
