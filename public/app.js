// app.js
// Frontend logic for booking nutritionist appointments

// 🔗 CHANGE THIS to your Render backend URL when deployed
const API_URL = "http://localhost:3000/api/appointments";

const form = document.getElementById("appointmentForm");
const messageEl = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  messageEl.textContent = "Submitting appointment...";
  messageEl.className = "info";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Submission failed");
    }

    messageEl.textContent = "✅ Appointment booked successfully. We will contact you soon.";
    messageEl.className = "success";
    form.reset();
  } catch (error) {
    messageEl.textContent = `❌ ${error.message}`;
    messageEl.className = "error";
  }
});