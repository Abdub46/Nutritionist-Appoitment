// dashboard.js
// Fetch and display appointments with Supabase authentication, real-time updates, and new appointment notifications

const SUPABASE_URL = "https://abcd1234xyz.supabase.co"; // replace with your Supabase URL
const SUPABASE_ANON_KEY = "your_anon_key"; // replace with your Supabase anon key

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const tableBody = document.querySelector('#appointmentsTable tbody');

// Notification badge element
const notificationBadge = document.createElement('div');
notificationBadge.style.background = 'red';
notificationBadge.style.color = 'white';
notificationBadge.style.padding = '2px 6px';
notificationBadge.style.borderRadius = '12px';
notificationBadge.style.fontSize = '0.8rem';
notificationBadge.style.marginLeft = '10px';
notificationBadge.textContent = '0';
document.querySelector('h1').appendChild(notificationBadge);

let unseenCount = 0;

async function checkSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = 'login.html';
  }
}

async function renderAppointments(appointments) {
  tableBody.innerHTML = '';
  appointments.forEach(app => {
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
}

async function fetchAppointments() {
  try {
    await checkSession();
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });
    if(error) throw error;
    renderAppointments(data);
  } catch(err) {
    console.error('Failed to fetch appointments:', err);
    tableBody.innerHTML = '<tr><td colspan="7">Failed to load appointments</td></tr>';
  }
}

// Real-time subscription with notifications
supabase
  .channel('appointments-channel')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'appointments' }, payload => {
    console.log('New appointment received:', payload);
    fetchAppointments();
    unseenCount += 1;
    notificationBadge.textContent = unseenCount;
  })
  .subscribe();

// Reset notification count when dashboard is clicked/focused
window.addEventListener('focus', () => {
  unseenCount = 0;
  notificationBadge.textContent = unseenCount;
});

// Logout button
const logoutBtn = document.createElement('button');
logoutBtn.textContent = 'Logout';
logoutBtn.style.marginBottom = '1rem';
logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'login.html';
});
document.querySelector('.container').prepend(logoutBtn);

// Initial fetch
fetchAppointments();

