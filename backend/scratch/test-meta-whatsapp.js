import dotenv from "dotenv";
import { sendWhatsAppText, getWhatsAppRuntimeStatus } from "../utils/whatsapp.js";

dotenv.config();

console.log("Starting Meta WhatsApp Cloud API diagnostic...");

const status = getWhatsAppRuntimeStatus();
console.log("Current Status:", JSON.stringify(status, null, 2));

if (status.provider !== "meta-cloud") {
    console.error("Error: WHATSAPP_PROVIDER must be set to 'meta-cloud' in .env for this test.");
    process.exit(1);
}

if (!status.configured) {
    console.error("Error: Meta Cloud credentials missing in .env.");
    process.exit(1);
}

const testNumber = process.env.SUPER_ADMIN_WHATSAPP_TO || "918219263983";
const templateName = process.env.WHATSAPP_CLOUD_OTP_TEMPLATE_NAME || "otp_verification";

const isHelloWorld = templateName === "hello_world";

const templatePayload = isHelloWorld 
    ? {
        name: templateName,
        language: { code: "en_US" }
    }
    : {
        name: templateName,
        language: { code: "en_US" },
        components: [
            {
                type: "body",
                parameters: [
                    { type: "text", text: "Test User" },
                    { type: "text", text: "123456" },
                    { type: "text", text: "10" }
                ]
            }
        ]
    };

console.log(`Attempting to send template message to ${testNumber} using template '${templateName}'...`);

sendWhatsAppText({
    to: testNumber,
    template: templatePayload
}).then(result => {
    console.log("Send Result:", result);
    if (result.sent) {
        console.log("SUCCESS: Message sent via Meta Cloud API.");
    } else {
        console.error("FAILED:", result.message);
    }
    process.exit(0);
}).catch(err => {
    console.error("Critical Error:", err);
    process.exit(1);
});
