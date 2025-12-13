const Page = require("../models/pageModel.js");

const createPage = async (req, res) => {
  try {
    const { name, slug, description, availableActions, order, group } =
      req.body;

    // Check name or slug exists
    const existingPage = await Page.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingPage) {
      return res.status(400).json({
        success: false,
        message: "Page name or slug already exists",
      });
    }

    // 🔹 Check order conflict
    if (order !== undefined) {
      const orderExists = await Page.findOne({ order });

      if (orderExists) {
        const lastOrder = await Page.findOne()
          .sort({ order: -1 })
          .select("order");

        const suggestedOrder = lastOrder ? lastOrder.order + 1 : 1;

        return res.status(400).json({
          success: false,
          message: `Order ${order} is already in use`,
          suggestedOrder,
        });
      }
    }

    // Create page
    const page = await Page.create({
      name,
      slug,
      description,
      availableActions,
      order,
      group: group || null, // ✅ optional
    });

    res.status(201).json({
      success: true,
      message: "Page created successfully",
      page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//-----------------------------------------------------//
//---------------------Get all pages-------------------//
//-----------------------------------------------------//

const getAllPages = async (req, res) => {
  try {
    const pages = await Page.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: pages.length,
      pages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get single page by ID
 */
const getPageById = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    res.status(200).json({
      success: true,
      page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update page
 */
const updatePage = async (req, res) => {
  try {
    const { name, slug, description, availableActions, isActive } = req.body;

    const page = await Page.findByIdAndUpdate(
      req.params.id,
      {
        name,
        slug,
        description,
        availableActions,
        isActive,
      },
      { new: true, runValidators: true }
    );

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Page updated successfully",
      page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPage,
  getAllPages,
  getPageById,
  updatePage,
};
