import Branch from "../models/branchModel.js";

export const createBranch = async (req, res) => {
  try {
    const branch = await Branch.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Branch Created Successfully",
      data: branch,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllBranch = async (req, res) => {
  try {
    const { region, state, district, city } = req.query;

    const filter = {};

    if (region) {
      filter.region = region;
    }

    if (state) {
      filter.state = state;
    }

    if (district) {
      filter.district = district;
    }
    if (city) {
      filter.city = city;
    }
    const branches = await Branch.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      total: branches.length,
      data: branches,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingleBranch = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: branch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Branch updated successfully.",
      data: branch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Branch deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
