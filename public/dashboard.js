// dashboard.js
// Fetch and display appointments on the nutritionist dashboard

const API_URL = "http://localhost:3000/api/appointments"; // Replace with Render URL in production

async function fetchAppointments() {
  try {
    const res = await fetch(API_URL);
    const json = await res.json();
    const tableBody = document.querySelector('#appointmentsTable tbody');
    tableBody.innerHTML = '';

    json.appointments.forEach(app => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${app.name}</td>
        <td>${app.gender || '-'}</td>
        <td>${app.age}</td>
        <td>${app.occupation || '-'}</td>
        <td>${app.location || '-'}</td>
        <td>${app.problem_description}</td>
        <td>${app.appointment_date}</td>
      `;
      tableBody.appendChild(tr);
    });
  } catch (err) {
    console.error('Failed to fetch appointments:', err);
  }
}

fetchAppointments();
