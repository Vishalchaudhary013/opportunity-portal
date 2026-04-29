import Form from "../models/Form.js";
import FormResponse from "../models/FormResponse.js";
import mongoose from "mongoose";

// ================= CREATE FORM =================
export const createForm = async (req, res) => {
  try {
    let formData = {};

    // ✅ SAFE PARSE
    try {
      formData = req.body.formData
        ? JSON.parse(req.body.formData)
        : req.body;
    } catch (err) {
      console.log("❌ JSON PARSE ERROR:", err);
      formData = req.body;
    }

    // ✅ SAFETY
    if (!formData.formSchema) {
      formData.formSchema = { fields: [] };
    }

    const files = req.files || [];

    console.log("📦 FILES:", files);

    // ✅ FILE HANDLING
    if (files.length > 0) {
      formData.formSchema.fields = (formData.formSchema.fields || []).map(field => {

        const file = files.find(f =>
          f.fieldname === `files[${field.id}]` ||
          f.fieldname.includes(field.id)
        );

        if (!file) return field;

        console.log("✅ MATCHED FILE:", field.id, file.path);

        if (field.type === "bannerUpload") {
          return { ...field, bannerUrl: file.path };
        }

        if (field.type === "pdfUpload") {
          return { ...field, pdfUrl: file.path };
        }

        if (field.type === "carouselUpload") {
          return {
            ...field,
            images: [{ src: file.path }]
          };
        }

        return field;
      });
    }

    const form = new Form({
  ...formData,
  companyName: formData.companyName || ""
});
    await form.save();

    res.status(201).json({
      success: true,
      data: form
    });

  } catch (err) {
    console.log("❌ CREATE FORM ERROR:", err);
    res.status(500).json({ message: "Error creating form" });
  }
};


// ================= UPDATE FORM =================
export const updateForm = async (req, res) => {
  try {
    let formData = {};

    // ✅ SAFE PARSE
    try {
      formData = req.body.formData
        ? JSON.parse(req.body.formData)
        : req.body;
    } catch (err) {
      console.log("❌ JSON PARSE ERROR:", err);
      formData = req.body;
    }

    // ✅ SAFETY
    if (!formData.formSchema) {
      formData.formSchema = { fields: [] };
    }

    const files = req.files || [];

    console.log("📦 UPDATE FILES:", files);

    if (files.length > 0) {
      formData.formSchema.fields = (formData.formSchema.fields || []).map(field => {

        const file = files.find(f =>
          f.fieldname === `files[${field.id}]` ||
          f.fieldname.includes(field.id)
        );

        if (!file) return field;

        console.log("✅ UPDATE MATCH:", field.id, file.path);

        if (field.type === "bannerUpload") {
          return { ...field, bannerUrl: file.path };
        }

        if (field.type === "pdfUpload") {
          return { ...field, pdfUrl: file.path };
        }

        if (field.type === "carouselUpload") {
          return {
            ...field,
            images: [{ src: file.path }]
          };
        }

        return field;
      });
    }

   const updated = await Form.findByIdAndUpdate(
  req.params.id,
  {
    ...formData,
    companyName: formData.companyName || ""
  },
  { new: true }
);

    res.json({
      success: true,
      data: updated
    });

  } catch (err) {
    console.log("❌ UPDATE ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
};


// ================= GET FORM =================
export const getFormById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Form ID" });
    }

    const form = await Form.findById(id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json(form);

  } catch (err) {
    console.log("❌ GET FORM ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= PUBLIC FORM =================
export const getPublicForm = async (req, res) => {
  const form = await Form.findById(req.params.id);

  if (!form || form.status !== "published") {
    return res.status(404).json({ message: "Form not found" });
  }

  res.json(form);
};


// ================= PUBLISH =================
export const publishForm = async (req, res) => {
  const form = await Form.findByIdAndUpdate(
    req.params.id,
    {
      status: "published",
      publishedUrl: `public-form/${req.params.id}`
    },
    { new: true }
  );

  res.json(form);
};


// ================= DELETE =================
export const deleteForm = async (req, res) => {
  await Form.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};


// ================= SUBMIT =================

export const submitForm = async (req, res) => {
  try {
    console.log("📩 BODY:", req.body);
    console.log("📦 FILES:", req.files);

    const formId = req.params.id;

    let data = {};
    let filesData = {};

    // ✅ FIXED DATA PARSE
    if (req.body.data) {
      data = req.body.data;
    }

    // optional cleanup
    Object.keys(data).forEach(key => {
      if (data[key] === "true") data[key] = true;
      else if (data[key] === "false") data[key] = false;
    });

    // ✅ FILES
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const fieldId = file.fieldname
          .replace("files[", "")
          .replace("]", "");

        filesData[fieldId] = file.path;
      });
    }

    console.log("🔥 FINAL DATA:", data);

    const response = await FormResponse.create({
      formId,
      data,
      files: filesData
    });

    res.json({
      success: true,
      message: "Submitted",
      data: response
    });

  } catch (err) {
    console.log("❌ ERROR:", err);
    res.status(500).json({ message: "Submission failed" });
  }
};

// ================= SUBMISSIONS =================
export const getSubmissions = async (req, res) => {
  res.json([]);
};

// ================= GET RESPONSES =================
export const getFormResponses = async (req, res) => {
  try {
    const responses = await FormResponse.find({
      formId: req.params.id
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: responses
    });

  } catch (err) {
    console.log("❌ GET RESPONSES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch responses" });
  }
};

export const getInternshipResponsesSummary = async (req, res) => {
  try {
    const result = await FormResponse.aggregate([
      {
        $group: {
          _id: "$formId",
          totalResponses: { $sum: 1 }
        }
      },

      // 🔥 SAFE OBJECT ID CONVERSION
      {
        $addFields: {
          formObjectId: {
            $toObjectId: "$_id"
          }
        }
      },

      // 🔥 LOOKUP
      {
        $lookup: {
          from: "forms",
          localField: "formObjectId",
          foreignField: "_id",
          as: "formDetails"
        }
      },

      {
        $unwind: "$formDetails"
      },

      {
        $project: {
          formId: "$_id",
          totalResponses: 1,
          name: "$formDetails.name",
          companyName: "$formDetails.companyName"
        }
      }
    ]);

    res.json({ success: true, data: result });

  } catch (err) {
    console.log("❌ SUMMARY ERROR:", err);
    res.status(500).json({ message: "Error" });
  }
};

// ================= DELETE RESPONSE =================
export const deleteResponse = async (req, res) => {
  try {
    await FormResponse.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Response deleted"
    });

  } catch (err) {
    console.log("❌ DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};