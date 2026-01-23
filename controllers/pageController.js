const Page = require("../models/pageModel.js");

//-----------------------------------------------------//
//---------------------Creata pages-------------------//
//-----------------------------------------------------//
const createPage = async (req, res) => {
  try {
    let { name, slug, description, availableActions, order, group, iconName } =
      req.body;

    // 🔹 Normalize slug
    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required",
      });
    }

    slug = slug.trim().toLowerCase();

    // Ensure single leading slash
    if (!slug.startsWith("/")) {
      slug = `/${slug}`;
    }
    slug = slug.replace(/\/+/g, "/"); // remove double slashes

    // 🔹 Check name or slug exists
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

    // 🔹 Create page
    const page = await Page.create({
      name,
      slug,
      iconName, // ✅ added
      description,
      availableActions,
      order,
      group: group || null,
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
    let { name, slug, description, availableActions, order, group, iconName } =
      req.body;

    // 🔹 Find page
    const page = await Page.findById(id);
    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    // 🔹 Normalize slug (only if provided)
    if (slug !== undefined) {
      slug = slug.trim().toLowerCase();

      if (!slug.startsWith("/")) {
        slug = `/${slug}`;
      }

      slug = slug.replace(/\/+/g, "/");
    }

    // 🔹 Check name / slug conflict (ignore self)
    if (name !== undefined || slug !== undefined) {
      const conflict = await Page.findOne({
        _id: { $ne: id },
        $or: [
          name !== undefined ? { name } : null,
          slug !== undefined ? { slug } : null,
        ].filter(Boolean),
      });

      if (conflict) {
        return res.status(400).json({
          success: false,
          message: "Page name or slug already exists",
        });
      }
    }

    // 🔹 Check order conflict
    if (order !== undefined) {
      const orderExists = await Page.findOne({
        _id: { $ne: id },
        order,
      });

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

    // 🔹 Update only provided fields
    if (name !== undefined) page.name = name;
    if (slug !== undefined) page.slug = slug;
    if (iconName !== undefined) page.iconName = iconName;
    if (description !== undefined) page.description = description;
    if (availableActions !== undefined)
      page.availableActions = availableActions;
    if (order !== undefined) page.order = order;
    if (group !== undefined) page.group = group || null;

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
