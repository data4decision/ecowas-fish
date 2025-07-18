// src/utils/notifications.js
import emailjs from "@emailjs/browser";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";

// EmailJS credentials
const SERVICE_ID = "service_123abc";
const TEMPLATE_ID = "__ejs-test-mail-service__";
const PUBLIC_KEY = "YdXH7zCJtfM6CuSxE";

/**
 * Send an email notification using EmailJS
 * @param {string} to_email - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} message - Email message (HTML allowed)
 */
export async function sendEmailNotification(to_email, subject, message) {
  if (!to_email) {
    console.warn("No email provided. Skipping email notification.");
    return;
  }

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email,
        subject,
        message: `<div style="font-family:Arial,sans-serif;color:#333;">
                    <h3>${subject}</h3>
                    <p>${message}</p>
                  </div>`
      },
      PUBLIC_KEY
    );
    console.log("✅ Email sent successfully to", to_email);
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
}

/**
 * Log admin actions to Firestore audit trail
 * @param {Object} log - { action, file, admin, timestamp }
 */
export async function logAuditTrail(log) {
  try {
    await addDoc(collection(db, "auditTrail"), log);
    console.log("📝 Audit log saved:", log);
  } catch (err) {
    console.error("❌ Audit log failed:", err);
  }
}

/**
 * Mock FCM push notification sender (to be replaced with real FCM integration)
 * @param {string} recipient - Email or user ID
 * @param {string} title - Notification title
 * @param {string} body - Notification message
 */
export async function sendFCMNotification(recipient, title, body) {
  try {
    console.log("📱 Simulated FCM notification:", {
      to: recipient,
      title,
      body
    });
    // Real implementation would send via Firebase Cloud Messaging or a server
  } catch (err) {
    console.error("❌ FCM notification failed:", err);
  }
}
