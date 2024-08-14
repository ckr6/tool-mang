document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    window.location.href = '/login.html';
  }

  const fetchDashboardData = () => {
    fetch('/api/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      const dashboardContent = document.getElementById('dashboard-content');
      dashboardContent.innerHTML = `
        <div class="p-4 bg-white shadow-md rounded-md">
          <h2 class="text-xl font-bold">Total de Ativos</h2>
          <p>${data.totalAssets}</p>
        </div>
        <div class="p-4 bg-white shadow-md rounded-md">
          <h2 class="text-xl font-bold">Total de Tickets</h2>
          <p>${data.totalTickets}</p>
        </div>
        <div class="p-4 bg-white shadow-md rounded-md">
          <h2 class="text-xl font-bold">Total de Empréstimos</h2>
          <p>${data.totalLoans}</p>
        </div>
        <div class="col-span-3 p-4 bg-white shadow-md rounded-md">
          <h2 class="text-xl font-bold">Tickets por Status</h2>
          <ul>
            ${data.ticketsByStatus.map(ticket => `
              <li>${ticket.status}: ${ticket.dataValues.count}</li>
            `).join('')}
          </ul>
        </div>
      `;
    })
    .catch(error => console.error('Erro ao buscar dados do dashboard:', error));
  };

  fetchDashboardData();
});
