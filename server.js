// server.js
// Nutritionist Appointment App – Backend API
// Tech stack: Node.js, Express, Supabase, Render-ready

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"; // Required for __dirname
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// **Serve frontend (static files in public folder)**
app.use(express.static(path.join(__dirname, "public")));

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // backend only

const supabase = createClient(supabaseUrl, supabaseKey);

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Nutritionist Appointment API is running",
  });
});

// Create appointment (public)
app.post("/api/appointments", async (req, res) => {
  const {
    name,
    gender,
    age,
    occupation,
    location,
    problem_description,
    appointment_date,
  } = req.body;

  if (!name || !age || !problem_description || !appointment_date) {
    return res.status(400).json({
      error: "Name, age, problem description and appointment date are required",
    });
  }

  try {
    const { data, error } = await supabase
      .from("appointments")
      .insert([
        {
          name,
          gender,
          age,
          occupation,
          location,
          problem_description,
          appointment_date,
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: data[0],
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to book appointment",
      details: err.message,
    });
  }
});

// Get all appointments (dashboard)
app.get("/api/appointments", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ appointments: data });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch appointments",
      details: err.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
