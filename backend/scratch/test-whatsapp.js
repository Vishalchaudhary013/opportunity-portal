import dotenv from "dotenv";
import { sendWhatsAppText, bootWhatsAppProvider, getWhatsAppRuntimeStatus } from "../utils/whatsapp.js";

dotenv.config();

console.log("Starting WhatsApp diagnostic...");

bootWhatsAppProvider();

const checkStatus = () => {
    const status = getWhatsAppRuntimeStatus();
    console.log("Current Status:", JSON.stringify(status, null, 2));

    if (status.connected) {
        console.log("WhatsApp is connected! Attempting to send test message...");
        sendWhatsAppText({
            to: process.env.SUPER_ADMIN_WHATSAPP_TO || "918219263983", // Example number from env or fallback
            body: "Test message from diagnostic script."
        }).then(result => {
            console.log("Send Result:", result);
            process.exit(0);
        }).catch(err => {
            console.error("Send Error:", err);
            process.exit(1);
        });
    } else if (status.lastError) {
        console.error("Initialization Error:", status.lastError);
        process.exit(1);
    } else if (status.requiresQr) {
        console.log("Action Required: Scan the QR code shown above.");
        // We'll wait a bit to see if it connects
    }
};

// Check status every 5 seconds
const interval = setInterval(checkStatus, 5000);

// Stop after 1 minute
setTimeout(() => {
    console.log("Diagnostic timeout. WhatsApp might be stuck or waiting for QR.");
    clearInterval(interval);
    process.exit(0);
}, 60000);
