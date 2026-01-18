// public/dashboard.js

const tableBody = document.querySelector("#appointmentsTable tbody");
const API_URL = "/api/appointments";

async function fetchAppointments() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    if (!res.ok) {
      tableBody.innerHTML = `<tr><td colspan="7">Failed to load appointments</td></tr>`;
      console.error("Error fetching appointments:", data);
      return;
    }

    tableBody.innerHTML = "";

    if (!data.appointments || data.appointments.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7">No appointments yet</td></tr>`;
      return;
    }

    data.appointments.forEach((appt) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${appt.name}</td>
        <td>${appt.gender || "-"}</td>
        <td>${appt.age}</td>
        <td>${appt.occupation || "-"}</td>
        <td>${appt.location || "-"}</td>
        <td>${appt.problem_description}</td>
        <td>${appt.appointment_date}</td>
      `;
      tableBody.appendChild(tr);
    });
  } catch (err) {
    console.error("Network error:", err);
    tableBody.innerHTML = `<tr><td colspan="7">Network error</td></tr>`;
  }
}

// Initial fetch
fetchAppointments();

// Optional: refresh every 30 seconds
setInterval(fetchAppointments, 30000);
