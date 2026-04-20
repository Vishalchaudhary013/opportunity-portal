import User from "../models/userModel.js";
import { sendWhatsAppText } from "./whatsapp.js";

const SUMMARY_HOUR = Number(process.env.DAILY_REG_SUMMARY_HOUR || 20);
const SUMMARY_MINUTE = Number(process.env.DAILY_REG_SUMMARY_MINUTE || 30);

let dailySummaryTimer = null;

const normalizeValue = (value) => String(value || "").trim();

const getStartOfToday = (now = new Date()) => {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  return start;
};

const toUniqueRecipients = (numbers) => [
  ...new Set(numbers.map((item) => normalizeValue(item)).filter(Boolean)),
];

const parseFallbackRecipients = () =>
  normalizeValue(process.env.SUPER_ADMIN_WHATSAPP_TO)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const buildDailySummaryMessage = ({ userCount, adminCount, timestamp }) => {
  const readableDate = timestamp.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  return [
    "Daily Registration Summary",
    `Date: ${readableDate}`,
    "",
    `New Users Registered: ${userCount}`,
    `New Admins Registered: ${adminCount}`,
    `Total New Registrations: ${userCount + adminCount}`,
  ].join("\n");
};

const getDelayUntilNextRun = (now = new Date()) => {
  const nextRun = new Date(now);
  nextRun.setHours(SUMMARY_HOUR, SUMMARY_MINUTE, 0, 0);

  if (nextRun <= now) {
    nextRun.setDate(nextRun.getDate() + 1);
  }

  return nextRun.getTime() - now.getTime();
};

const sendDailySummary = async () => {
  const now = new Date();
  const todayStart = getStartOfToday(now);

  const [userCount, adminCount, superAdmins] = await Promise.all([
    User.countDocuments({
      role: "user",
      createdAt: { $gte: todayStart, $lte: now },
    }),
    User.countDocuments({
      role: "admin",
      createdAt: { $gte: todayStart, $lte: now },
    }),
    User.find({ role: "super_admin" }).select("whatsappNumber").lean(),
  ]);

  const recipients = toUniqueRecipients([
    ...superAdmins.map((item) => item.whatsappNumber),
    ...parseFallbackRecipients(),
  ]);

  if (recipients.length === 0) {
    console.warn(
      "Daily registration summary skipped: no super admin WhatsApp recipients available.",
    );
    return;
  }

  const message = buildDailySummaryMessage({
    userCount,
    adminCount,
    timestamp: now,
  });

  const results = await Promise.all(
    recipients.map((recipient) =>
      sendWhatsAppText({
        to: recipient,
        body: message,
      }),
    ),
  );

  const sentCount = results.filter((item) => item?.sent).length;
  console.log(
    `Daily registration summary sent to ${sentCount}/${recipients.length} super admin recipient(s).`,
  );
};

const scheduleNextDailySummary = () => {
  const delay = getDelayUntilNextRun();
  dailySummaryTimer = setTimeout(async () => {
    try {
      await sendDailySummary();
    } catch (error) {
      console.error("Daily registration summary failed:", error);
    } finally {
      scheduleNextDailySummary();
    }
  }, delay);
};

export const startDailySuperAdminRegistrationNotifier = () => {
  if (dailySummaryTimer) {
    return;
  }

  scheduleNextDailySummary();

  console.log(
    `Daily registration notifier scheduled for ${String(SUMMARY_HOUR).padStart(2, "0")}:${String(SUMMARY_MINUTE).padStart(2, "0")} server time.`,
  );
};
