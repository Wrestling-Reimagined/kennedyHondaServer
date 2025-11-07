import twilio from "twilio";
import dotenv from "dotenv";
import { Lead } from "../types/lead";
import { smsRateLimiter } from "./rateLimiter";

dotenv.config();

let twilioClient: twilio.Twilio | null = null;

const getTwilioClient = (): twilio.Twilio => {
  if (twilioClient) {
    return twilioClient;
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
  const robPhoneNumber = process.env.ROB_PHONE_NUMBER;

  if (!accountSid || !authToken || !twilioPhoneNumber || !robPhoneNumber) {
    throw new Error(
      "Missing Twilio configuration. Please check your .env file."
    );
  }

  twilioClient = twilio(accountSid, authToken);
  return twilioClient;
};

export const sendSmsNotification = async (lead: Lead): Promise<void> => {
  // Check rate limit before attempting to send
  if (!smsRateLimiter.canSend()) {
    const count = smsRateLimiter.getCount();
    throw new Error(
      `Daily SMS limit reached (${count}/50 messages sent today). Please try again tomorrow.`
    );
  }

  try {
    const client = getTwilioClient();
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER!;
    const robPhoneNumber = process.env.ROB_PHONE_NUMBER!;

    const message = `New Lead from Rob's Car Site:\n\nName: ${
      lead.name
    }\nEmail: ${lead.email}\nPhone: ${lead.phone}${
      lead.message ? `\nMessage: ${lead.message}` : ""
    }`;

    await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: robPhoneNumber,
    });

    // Increment the counter after successful send
    smsRateLimiter.increment();
    const remaining = smsRateLimiter.getRemaining();

    console.log(
      `SMS notification sent successfully for lead: ${
        lead.name
      } (${smsRateLimiter.getCount()}/50 messages sent today, ${remaining} remaining)`
    );
  } catch (error) {
    console.error("Error sending SMS notification:", error);
    throw new Error("Failed to send SMS notification");
  }
};
