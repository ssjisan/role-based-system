const Page = require("../models/pageModel.js");

//-----------------------------------------------------//
//---------------------Creata pages-------------------//
//-----------------------------------------------------//
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
//---------------------Creata pages-------------------//
//-----------------------------------------------------//

//-----------------------------------------------------//
//---------------------Get all pages-------------------//
//-----------------------------------------------------//

const getAllPages = async (req, res) => {
  try {
    const pages = await Page.find()
      .populate("group", "name")
      .sort({ order: 1 });

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

//-----------------------------------------------------//
//---------------------Get all pages-------------------//
//-----------------------------------------------------//

//-----------------------------------------------------//
//---------------------Get pages By id-----------------//
//-----------------------------------------------------//
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

//-----------------------------------------------------//
//---------------------Update Page---------------------//
//-----------------------------------------------------//
const updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, availableActions, order, group } =
      req.body;

    // Find page by id
    const page = await Page.findById(id);
    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    // Check if name or slug conflicts with other pages
    const conflict = await Page.findOne({
      _id: { $ne: id }, // ignore current page
      $or: [{ name }, { slug }],
    });
    if (conflict) {
      return res.status(400).json({
        success: false,
        message: "Page name or slug already exists",
      });
    }

    // Check order conflict
    if (order !== undefined) {
      const orderExists = await Page.findOne({ _id: { $ne: id }, order });
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

    // Update fields
    page.name = name;
    page.slug = slug;
    page.description = description;
    page.availableActions = availableActions;
    page.order = order;
    page.group = group || null;

    await page.save();

    res.status(200).json({
      success: true,
      message: "Page updated successfully",
      page,
    });
  } catch (error) {
    console.error("Update page error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//-----------------------------------------------------//
//---------------------Update Page---------------------//
//-----------------------------------------------------//

//-----------------------------------------------------//
//---------------------Delete Page---------------------//
//-----------------------------------------------------//

const deletePage = async (req, res) => {
  try {
    const { id } = req.params;

    // Find page by id
    const page = await Page.findById(id);
    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    // Delete page
    await Page.findByIdAndDelete(id);

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

//-----------------------------------------------------//
//---------------------Delete Page---------------------//
//-----------------------------------------------------//

module.exports = {
  createPage,
  getAllPages,
  getPageById,
  updatePage,
  deletePage,
};
