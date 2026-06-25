import customCategory from "../models/customCategoryModel.js";

const createSlug = (text = "") => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const createCustomCategory = async (req, res) => {
  try {
    const { title, opportunityType, colors, isActive } = req.body;

    if (!title || !opportunityType) {
      return res.status(400).json({
        success: false,
        message: "Title and Opportunity type is required",
      });
    }

    const slug = createSlug(title);

    const existingCategory = await customCategory.findOne({ slug });
    if (existingCategory) {
      return res.slug(409).json({
        success: false,
        message: "A category with this title already exists",
      });
    }

    const category = await customCategory.create({
      title: title.trim(),
      slug,
      opportunityType: opportunityType.trim(),
      colors: {
        bg: colors?.bg || "#EEF2FF",
        mid: colors?.mid || "#818CF8",
        dark: colors?.dark || "#4F46E5",
      },
      isActive: isActive ?? true,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCustomCategory = async (req, res) => {
  try {
    const category = await customCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCustomCategory = async (req, res) => {
  try {
    const { title, opportunityType, colors, isActive } = req.body;

    const category = await customCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (title) {
      const newSlug = createSlug(title);

      const slugAlreadyUsed = await customCategory.findOne({
        slug: newSlug,
        _id: { $ne: req.params.id },
      });

      if (slugAlreadyUsed) {
        return res.status(409).json({
          success: false,
          message: "Another category already uses this title",
        });
      }

      category.title = title.trim();
      category.slug = newSlug;
    }
    

    if (opportunityType) {
      category.opportunityType = opportunityType.trim();
    }
    if (colors) {
      category.colors = {
        bg: colors.bg || category.colors.bg,
        mid: colors.mid || category.colors.mid,
        dark: colors.dark || category.colors.dark,
      };
    }

    if (isActive !== undefined) {
      category.isActive = isActive;
    }

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteCustomCategory = async (req,res) => {

  try {
    const category = await customCategory.findByIdAndDelete(req.params.id)

    if (!category) {
      return res.status(404).json({
        success:false,
        message:"Category not found"
      })
      
    }

    return res.status(200).json({
      success:true,
      message:"Category deleted successfully "
    })

  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    })
    
  }
}