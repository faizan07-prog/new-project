import express from "express";
import pool from "./db.js";

const router = express.Router();

// POST - Handle contact form submission
router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Insert into database
    const query =
      "INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3) RETURNING id;";
    const result = await pool.query(query, [name, email, message]);

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully!",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error("Database error:", error);
    res
      .status(500)
      .json({ error: "Failed to send message. Please try again later." });
  }
});

// GET - Retrieve all contact messages (protected - add authentication in production)
router.get("/contact/messages", async (req, res) => {
  try {
    const query = "SELECT * FROM contact_messages ORDER BY created_at DESC;";
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
});

export default router;
