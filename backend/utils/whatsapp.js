import qrcode from "qrcode-terminal";
import WhatsAppWeb from "whatsapp-web.js";
import fs from "fs";
import { execSync } from "child_process";

const { Client, LocalAuth } = WhatsAppWeb;

const normalizeValue = (value) => String(value || "").trim();

const getProvider = () =>
  normalizeValue(
    process.env.WHATSAPP_PROVIDER || "whatsapp-web-js",
  ).toLowerCase();

const getWhatsAppSender = () => {
  const from = normalizeValue(process.env.TWILIO_WHATSAPP_FROM);
  if (!from) {
    return "";
  }

  return from.startsWith("whatsapp:") ? from : `whatsapp:${from}`;
};

const normalizePhoneNumber = (value) => {
  const raw = normalizeValue(value).replace(/[^\d+]/g, "");
  if (!raw) {
    return "";
  }

  if (raw.startsWith("+")) {
    return raw;
  }

  if (raw.length === 10) {
    return `+91${raw}`;
  }

  if (raw.length === 11 && raw.startsWith("0")) {
    return `+91${raw.slice(1)}`;
  }

  if (raw.length === 12 && raw.startsWith("91")) {
    return `+${raw}`;
  }

  return `+${raw}`;
};

const twilioConfigured = () =>
  Boolean(
    normalizeValue(process.env.TWILIO_ACCOUNT_SID) &&
    normalizeValue(process.env.TWILIO_AUTH_TOKEN) &&
    getWhatsAppSender(),
  );

let webClient = null;
let webClientReady = false;
let webClientInitializing = false;
let webClientLastError = "";
let webClientRetryCount = 0;
let webClientRetryTimer = null;
let webClientLockRecoveryAttempted = false;
let webClientUsingFallbackSession = false;
let protocolErrorCrashGuardInstalled = false;

const WEB_CLIENT_MAX_RETRIES = Number(
  process.env.WHATSAPP_WEB_MAX_RETRIES || 5,
);
const WEB_CLIENT_RETRY_DELAY_MS = Number(
  process.env.WHATSAPP_WEB_RETRY_DELAY_MS || 4000,
);

const getWebClientAuthConfig = () => {
  const baseClientId = normalizeValue(
    process.env.WHATSAPP_WEB_CLIENT_ID || "internship-backend",
  );
  const clientId = webClientUsingFallbackSession
    ? `${baseClientId}-fallback`
    : baseClientId;
  const dataPath = normalizeValue(
    process.env.WHATSAPP_WEB_SESSION_PATH || ".wwebjs_auth",
  );

  return {
    clientId,
    dataPath,
    sessionPath: `${dataPath}/session-${clientId}`,
  };
};

const clearStaleChromiumLockFiles = () => {
  try {
    const { sessionPath } = getWebClientAuthConfig();

    if (!fs.existsSync(sessionPath)) {
      return false;
    }

    const lockFileNames = [
      "SingletonLock",
      "SingletonSocket",
      "SingletonCookie",
    ];

    let removedAny = false;
    for (const fileName of lockFileNames) {
      const filePath = `${sessionPath}/${fileName}`;
      if (fs.existsSync(filePath)) {
        fs.rmSync(filePath, { force: true });
        removedAny = true;
      }
    }

    return removedAny;
  } catch (error) {
    console.error(
      "Failed to clear stale WhatsApp Web lock files:",
      error?.message || error,
    );
    return false;
  }
};

const terminateSessionBoundBrowserProcesses = () => {
  if (process.platform !== "win32") {
    return false;
  }

  try {
    const { dataPath } = getWebClientAuthConfig();
    const normalizedPath = dataPath.replace(/\\/g, "/").toLowerCase();

    const command = [
      "$ErrorActionPreference = 'SilentlyContinue'",
      "$killed = 0",
      "$processes = Get-CimInstance Win32_Process",
      "$targets = $processes | Where-Object {",
      "  ($_.Name -in @('chrome.exe','msedge.exe')) -and",
      "  $_.CommandLine -and",
      `  ($_.CommandLine.ToLower().Contains('${normalizedPath}'))`,
      "}",
      "foreach ($proc in $targets) {",
      "  Stop-Process -Id $proc.ProcessId -Force -ErrorAction SilentlyContinue",
      "  $killed++",
      "}",
      "Write-Output $killed",
    ].join("; ");

    const result = execSync(`powershell -NoProfile -Command \"${command}\"`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });

    const killed = Number(String(result || "0").trim());
    return Number.isFinite(killed) && killed > 0;
  } catch {
    return false;
  }
};

const resolveChromeExecutablePath = () => {
  const envPath = normalizeValue(process.env.WHATSAPP_WEB_CHROME_PATH);
  if (envPath && fs.existsSync(envPath)) {
    return envPath;
  }

  if (process.platform !== "win32") {
    const linuxCandidates = [
      "/usr/bin/google-chrome",
      "/usr/bin/google-chrome-stable",
      "/usr/bin/chromium-browser",
      "/usr/bin/chromium",
    ];
    const foundLinux = linuxCandidates.find((candidate) =>
      fs.existsSync(candidate),
    );
    if (foundLinux) return foundLinux;
  }

  const windowsCandidates = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  ];

  const found = windowsCandidates.find((candidate) => fs.existsSync(candidate));
  return found || "";
};

const scheduleWebClientReinitialize = (reason) => {
  if (getProvider() !== "whatsapp-web-js") {
    return;
  }

  if (webClientReady || webClientInitializing) {
    return;
  }

  const lockConflict = String(reason || "")
    .toLowerCase()
    .includes("browser is already running");

  if (lockConflict) {
    if (!webClientLockRecoveryAttempted) {
      webClientLockRecoveryAttempted = true;
      const killed = terminateSessionBoundBrowserProcesses();
      const cleared = clearStaleChromiumLockFiles();

      if (killed && cleared) {
        console.warn(
          "WhatsApp Web lock detected. Terminated stale browser session and cleared lock files; retrying initialization.",
        );
      } else if (killed) {
        console.warn(
          "WhatsApp Web lock detected. Terminated stale browser session; retrying initialization.",
        );
      } else if (cleared) {
        console.warn(
          "WhatsApp Web lock detected. Cleared stale Chromium lock files and retrying initialization.",
        );
      } else {
        console.warn(
          "WhatsApp Web lock detected. Retrying initialization once to recover session lock.",
        );
      }
    } else {
      if (!webClientUsingFallbackSession) {
        webClientUsingFallbackSession = true;
        webClientLockRecoveryAttempted = false;
        console.warn(
          "WhatsApp Web primary session remains locked. Switching to fallback session id and retrying.",
        );
      } else {
        console.error(
          "WhatsApp Web lock persists. Stop stale Chrome/Edge processes using .wwebjs_auth and restart backend.",
        );
        return;
      }
    }
  }

  if (webClientRetryCount >= WEB_CLIENT_MAX_RETRIES) {
    console.error(
      "WhatsApp Web initialization retries exhausted.",
      reason || "",
    );
    return;
  }

  if (webClientRetryTimer) {
    return;
  }

  webClientRetryCount += 1;
  webClientRetryTimer = setTimeout(() => {
    webClientRetryTimer = null;
    webClient = null;
    webClientInitializing = false;
    initializeWebClient();
  }, WEB_CLIENT_RETRY_DELAY_MS);
};

const initializeWebClient = () => {
  if (
    webClient ||
    webClientInitializing ||
    getProvider() !== "whatsapp-web-js"
  ) {
    return;
  }

  webClientInitializing = true;
  webClientLastError = "";

  webClient = new Client({
    authStrategy: new LocalAuth({
      clientId: getWebClientAuthConfig().clientId,
      dataPath: getWebClientAuthConfig().dataPath,
    }),
    puppeteer: {
      executablePath: resolveChromeExecutablePath() || undefined,
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-zygote",
      ],
    },
    takeoverOnConflict: true,
    takeoverTimeoutMs: 0,
  });

  webClient.on("qr", (qr) => {
    webClientReady = false;
    console.log("WhatsApp Web QR received. Scan in terminal to authenticate.");
    qrcode.generate(qr, { small: true });
  });

  webClient.on("ready", () => {
    webClientReady = true;
    webClientInitializing = false;
    webClientLastError = "";
    webClientRetryCount = 0;
    webClientLockRecoveryAttempted = false;
    if (webClientUsingFallbackSession) {
      console.warn(
        "WhatsApp Web connected using fallback session id. You may need to scan QR once for this session.",
      );
    }
    console.log("WhatsApp Web client is ready.");
  });

  webClient.on("authenticated", () => {
    console.log("WhatsApp Web client authenticated.");
  });

  webClient.on("auth_failure", (message) => {
    webClientReady = false;
    webClientInitializing = false;
    webClientLastError = String(message || "Authentication failed.");
    console.error("WhatsApp Web auth failed:", message);
    webClient = null;
    scheduleWebClientReinitialize(message);
  });

  webClient.on("disconnected", (reason) => {
    webClientReady = false;
    webClientInitializing = false;
    webClientLastError = `Disconnected: ${String(reason || "unknown reason")}`;
    console.warn("WhatsApp Web disconnected:", reason);
    webClient = null;
    scheduleWebClientReinitialize(reason);
  });

  webClient.initialize().catch((error) => {
    webClientInitializing = false;
    webClientReady = false;
    webClientLastError = String(error?.message || "Initialization failed.");
    console.error(
      "Failed to initialize WhatsApp Web client:",
      error.message,
      "Set WHATSAPP_WEB_CHROME_PATH in .env if Chrome path is custom.",
    );

    webClient = null;
    scheduleWebClientReinitialize(error?.message || "init_error");
  });
};

const installProtocolErrorCrashGuard = () => {
  if (protocolErrorCrashGuardInstalled) {
    return;
  }

  protocolErrorCrashGuardInstalled = true;

  process.on("uncaughtException", (error) => {
    const message = String(error?.message || "");
    const stack = String(error?.stack || "");

    const isKnownWhatsAppProtocolError =
      message.includes("Network.getResponseBody") &&
      (stack.includes("whatsapp-web.js") || stack.includes("puppeteer"));

    if (!isKnownWhatsAppProtocolError) {
      console.error("Unhandled uncaught exception:", error);
      process.exit(1);
      return;
    }

    webClientReady = false;
    webClientInitializing = false;
    webClientLastError = message;
    webClient = null;

    console.error(
      "Recovered from WhatsApp Web protocol error. Reinitializing client:",
      message,
    );

    scheduleWebClientReinitialize(message);
  });
};

const toWhatsAppWebChatId = (recipient) => {
  const normalized = normalizePhoneNumber(recipient);
  if (!normalized) {
    return "";
  }
  return `${normalized.replace("+", "")}@c.us`;
};

export const isWhatsAppConfigured = () => {
  const provider = getProvider();
  if (provider === "whatsapp-web-js") {
    return true;
  }
  if (provider === "twilio") {
    return twilioConfigured();
  }
  return false;
};

export const getWhatsAppRuntimeStatus = () => {
  const provider = getProvider();

  if (provider === "whatsapp-web-js") {
    return {
      provider,
      configured: true,
      connected: webClientReady,
      initializing: webClientInitializing,
      requiresQr: !webClientReady,
      message: webClientReady
        ? "WhatsApp Web is connected."
        : "Scan QR in backend terminal to connect WhatsApp Web.",
      lastError: webClientLastError,
    };
  }

  if (provider === "twilio") {
    const configured = twilioConfigured();
    return {
      provider,
      configured,
      connected: configured,
      initializing: false,
      requiresQr: false,
      message: configured
        ? "Twilio WhatsApp is configured."
        : "Twilio credentials are missing.",
      lastError: "",
    };
  }

  return {
    provider,
    configured: false,
    connected: false,
    initializing: false,
    requiresQr: false,
    message: "Invalid WHATSAPP_PROVIDER. Use whatsapp-web-js or twilio.",
    lastError: "",
  };
};

const sendWithWhatsAppWeb = async ({ to, body }) => {
  initializeWebClient();

  const chatId = toWhatsAppWebChatId(to);
  if (!chatId) {
    return {
      sent: false,
      message:
        "WhatsApp notifications are skipped because no valid recipient number was provided.",
    };
  }

  if (!webClient || !webClientReady) {
    return {
      sent: false,
      message:
        "WhatsApp Web is not ready yet. Scan the QR code shown in backend terminal and retry.",
    };
  }

  await webClient.sendMessage(chatId, String(body || ""));

  return {
    sent: true,
    message: "WhatsApp message sent successfully via whatsapp-web.js.",
  };
};

const sendWithTwilio = async ({ to, body }) => {
  if (!twilioConfigured()) {
    return {
      sent: false,
      message:
        "WhatsApp notifications are skipped because Twilio settings are not configured.",
    };
  }

  const recipient = normalizePhoneNumber(to);
  if (!recipient) {
    return {
      sent: false,
      message:
        "WhatsApp notifications are skipped because no recipient number was provided.",
    };
  }

  const payload = new URLSearchParams();
  payload.set("From", getWhatsAppSender());
  payload.set("To", `whatsapp:${recipient}`);
  payload.set("Body", String(body || ""));

  const accountSid = normalizeValue(process.env.TWILIO_ACCOUNT_SID);
  const authToken = normalizeValue(process.env.TWILIO_AUTH_TOKEN);
  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const authorization = `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Twilio WhatsApp send failed with status ${response.status}: ${errorText}`,
    );
  }

  const data = await response.json();
  return {
    sent: true,
    message: "WhatsApp message sent successfully via Twilio.",
    sid: data.sid,
  };
};

const sendWhatsAppMessage = async ({ to, body }) => {
  const provider = getProvider();

  if (provider === "whatsapp-web-js") {
    return sendWithWhatsAppWeb({ to, body });
  }

  if (provider === "twilio") {
    return sendWithTwilio({ to, body });
  }

  return {
    sent: false,
    message:
      "WhatsApp notifications are skipped because WHATSAPP_PROVIDER is invalid. Use whatsapp-web-js or twilio.",
  };
};

export const sendWhatsAppText = async ({ to, body }) => {
  try {
    return await sendWhatsAppMessage({ to, body });
  } catch (error) {
    return {
      sent: false,
      message: `WhatsApp notification failed: ${error.message}`,
    };
  }
};

const buildApplicantMessage = (application) =>
  [
    `Hi ${application.name},`,
    "",
    `Your application for ${application.opportunityTitle} (${application.opportunityType}) has been received.`,
    "",
    `Company: ${application.company || "N/A"}`,
    `Phone: ${application.phone || "N/A"}`,
    `Email: ${application.email}`,
    "",
    "Thank you for applying.",
  ].join("\n");

const buildAdminMessage = (application) =>
  [
    `New application received for ${application.opportunityTitle} (${application.opportunityType}).`,
    "",
    `Applicant: ${application.name}`,
    `Phone: ${application.phone || "N/A"}`,
    `Email: ${application.email}`,
    `Company: ${application.company || "N/A"}`,
    `Status: ${application.status || "New"}`,
  ].join("\n");

export const sendApplicationWhatsAppNotifications = async ({
  application,
  applicantRecipient,
  adminRecipient,
}) => {
  const applicantResult = await sendWhatsAppMessage({
    to: applicantRecipient || application.phone,
    body: buildApplicantMessage(application),
  }).catch((error) => ({
    sent: false,
    message: `WhatsApp message to applicant failed: ${error.message}`,
  }));

  const adminRecipientNumber =
    adminRecipient?.whatsappNumber ||
    (adminRecipient?.role === "super_admin"
      ? process.env.SUPER_ADMIN_WHATSAPP_TO
      : process.env.ADMIN_WHATSAPP_TO);

  const adminResult = await sendWhatsAppMessage({
    to: adminRecipientNumber,
    body: buildAdminMessage(application),
  }).catch((error) => ({
    sent: false,
    message: `WhatsApp message to admin failed: ${error.message}`,
  }));

  return {
    applicant: applicantResult,
    admin: adminResult,
  };
};

export const bootWhatsAppProvider = () => {
  installProtocolErrorCrashGuard();
  initializeWebClient();
};
