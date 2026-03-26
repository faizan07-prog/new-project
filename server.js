import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./backend/routes.js";
import pool from "./backend/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, "frontend")));

// API Routes
app.use("/api", routes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Server is running" });
});

// Serve index.html for all other routes (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Initialize database tables
async function initializeDatabase() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createTableQuery);
    console.log("✓ Database table created successfully");
  } catch (error) {
    console.error("✗ Error creating table:", error.message);
    console.error("Full error:", error);
  }
}

// Database status endpoint (useful for debugging)
app.get("/api/db-status", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.status(200).json({
      status: "connected",
      time: result.rows[0].now,
      message: "Database connection successful",
    });
  } catch (error) {
    res.status(500).json({
      status: "disconnected",
      error: error.message,
      message: "Database connection failed",
    });
  }
});

// Start server
app.listen(PORT, async () => {
  await initializeDatabase();
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 Contact endpoint: http://localhost:${PORT}/api/contact`);
  console.log(`🔍 DB Status endpoint: http://localhost:${PORT}/api/db-status`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await pool.end();
  process.exit(0);
});
