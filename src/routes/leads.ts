import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { Lead } from "../types/lead";
import { sendSmsNotification } from "../services/twilioService";

const router = express.Router();

const validateLead = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("phone").trim().notEmpty().withMessage("Phone number is required"),
  body("message").optional().trim(),
];

router.post("/leads", validateLead, async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const leadData: Lead = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message || "",
    };

    // Send SMS notification
    await sendSmsNotification(leadData);

    res.status(200).json({
      success: true,
      message: "Lead submitted successfully",
    });
  } catch (error) {
    console.error("Error processing lead:", error);

    // Check if it's a rate limit error
    if (
      error instanceof Error &&
      error.message.includes("Daily SMS limit reached")
    ) {
      return res.status(429).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to process lead submission",
    });
  }
});

export default router;
