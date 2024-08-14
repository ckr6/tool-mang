document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    window.location.href = '/login.html';
  }

  const fetchReport = () => {
    fetch('/api/reports/generate', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      const reportContent = document.getElementById('report-content');
      reportContent.innerHTML = `
        <p>Total Assets: ${data.totalAssets}</p>
        <p>Total Users: ${data.totalUsers}</p>
        <p>Total Active Loans: ${data.totalActiveLoans}</p>
        <p>Total Overdue Loans: ${data.totalOverdueLoans}</p>
        <h2>Active Loans:</h2>
        <ul>${data.activeLoans.map(loan => `<li>User: ${loan.User.username}, Asset: ${loan.Asset.name}, Start Date: ${new Date(loan.startDate).toLocaleDateString()}, End Date: ${loan.endDate ? new Date(loan.endDate).toLocaleDateString() : 'N/A'}</li>`).join('')}</ul>
        <h2>Overdue Loans:</h2>
        <ul>${data.overdueLoans.map(loan => `<li>User: ${loan.User.username}, Asset: ${loan.Asset.name}, Start Date: ${new Date(loan.startDate).toLocaleDateString()}, End Date: ${loan.endDate ? new Date(loan.endDate).toLocaleDateString() : 'N/A'}</li>`).join('')}</ul>
      `;
    })
    .catch(error => console.error('Error fetching report:', error));
  };

  fetchReport();
});
