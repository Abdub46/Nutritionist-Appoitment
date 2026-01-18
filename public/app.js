// public/appointment.js

const form = document.getElementById("appointmentForm");
const messageEl = document.getElementById("message");

// Use relative URL since frontend is served from same backend
const API_URL = "/api/appointments";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name: document.getElementById("name").value.trim(),
    gender: document.getElementById("gender").value,
    age: parseInt(document.getElementById("age").value),
    occupation: document.getElementById("occupation").value.trim(),
    location: document.getElementById("location").value.trim(),
    problem_description: document.getElementById("problem_description").value.trim(),
    appointment_date: document.getElementById("appointment_date").value,
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      messageEl.textContent = "✅ Appointment booked successfully!";
      form.reset();
    } else {
      messageEl.textContent = "❌ " + (data.error || "Failed to book appointment");
    }
  } catch (err) {
    console.error("Network error:", err);
    messageEl.textContent = "❌ Network error. Try again.";
  }
});


