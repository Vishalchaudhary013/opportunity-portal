import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";
import internshipRoutes from "./routers/internshipRoutes.js";
import globalProgramRoutes from "./routers/globalProgramRoutes.js";
import applicationRoutes from "./routers/applicationRoutes.js";
import authRoutes from "./routers/authRoutes.js";
import { isMailConfigured } from "./utils/mailer.js";
import {
  bootWhatsAppProvider,
  isWhatsAppConfigured,
} from "./utils/whatsapp.js";
import { startDailySuperAdminRegistrationNotifier } from "./utils/dailyRegistrationNotifier.js";
const app = express();

dotenv.config();

const port = process.env.PORT || 5000;
connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/internships", internshipRoutes);
app.use("/api/global-programs", globalProgramRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/auth", authRoutes);

app.use((error, req, res, next) => {
  if (error.code === 11000) {
    res.status(409).json({ message: "Duplicate value conflict." });
    return;
  }

  if (error.name === "MulterError") {
    if (error.code === "LIMIT_FILE_SIZE") {
      res
        .status(400)
        .json({ message: "Uploaded file is too large. Maximum size is 5MB." });
      return;
    }
    res.status(400).json({ message: error.message });
    return;
  }

  if (error.statusCode) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  if (error.name === "ValidationError") {
    res
      .status(400)
      .json({ message: "Validation failed.", error: error.message });
    return;
  }

  if (error.name === "CastError") {
    res.status(400).json({ message: "Invalid resource id." });
    return;
  }

  if (error.message === "Only PDF resume uploads are allowed.") {
    res.status(400).json({ message: error.message });
    return;
  }

  if (error.message === "Only JPG, PNG, or WEBP logo files are allowed.") {
    res.status(400).json({ message: error.message });
    return;
  }

  console.error("Unhandled server error:", error);
  res.status(500).json({ message: "Internal server error." });
});

app.listen(port, () => {
  console.log(`Listing on port : ${port}`);

  bootWhatsAppProvider();
  startDailySuperAdminRegistrationNotifier();

  if (!isMailConfigured()) {
    console.warn(
      "SMTP mail is not configured. Application confirmation emails will be skipped until SMTP_URL or SMTP_HOST/SMTP_USER/SMTP_PASS is set.",
    );
  }

  if (!isWhatsAppConfigured()) {
    console.warn(
      "WhatsApp provider is not configured correctly. Set WHATSAPP_PROVIDER=whatsapp-web-js or twilio and add required provider environment variables.",
    );
  }
});
