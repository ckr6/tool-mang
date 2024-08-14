document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  // Função para carregar usuários e ativos
  const loadFormOptions = () => {
    fetch('/api/users', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(response => response.json())
      .then(users => {
        const userSelect = document.getElementById('user-select');
        users.forEach(user => {
          const option = document.createElement('option');
          option.value = user.id;
          option.textContent = user.name;
          userSelect.appendChild(option);
        });
      });

    fetch('/api/assets?status=Disponível', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(response => response.json())
      .then(assets => {
        const assetSelect = document.getElementById('asset-select');
        assets.forEach(asset => {
          const option = document.createElement('option');
          option.value = asset.id;
          option.textContent = asset.name;
          assetSelect.appendChild(option);
        });
      });
  };
  
  // Função para buscar e listar os empréstimos
  const fetchLoans = (query = '', status = '') => {
    let url = `/api/loans?search=${query}`;
    if (status) {
      url += `&status=${status}`;
    }
  
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      const loanList = document.getElementById('loan-list');
      loanList.innerHTML = '';
      data.forEach(loan => {
        const item = document.createElement('div');
        item.className = 'p-4 bg-white shadow-md rounded-md';
        item.innerHTML = `
          <h2 class="text-xl font-bold">Empréstimo #${loan.id}</h2>
          <p>Usuário: ${loan.user.name}</p>
          <p>Ativo: ${loan.asset.name}</p>
          <p>Data do Empréstimo: ${new Date(loan.loanDate).toLocaleDateString()}</p>
          <p>Data de Devolução: ${loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : 'Ainda não devolvido'}</p>
        `;
        loanList.appendChild(item);
      });
    })
    .catch(error => console.error('Erro ao buscar empréstimos:', error));
  };

  // Listener para o filtro de status
  document.getElementById('status-filter').addEventListener('change', () => {
    const status = document.getElementById('status-filter').value;
    fetchLoans('', status);
  });

  // Função para criar um novo empréstimo
  const createLoan = (event) => {
    event.preventDefault();
    
    const userId = document.getElementById('user-select').value;
    const assetId = document.getElementById('asset-select').value;
    const loanDate = document.getElementById('loan-date').value;
    const returnDate = document.getElementById('return-date').value;

    fetch('/api/loans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId, assetId, loanDate, returnDate })
    })
    .then(response => response.json())
    .then(data => {
      alert('Empréstimo criado com sucesso!');
      fetchLoans(); // Atualiza a lista de empréstimos
    })
    .catch(error => console.error('Erro ao criar empréstimo:', error));
  };

  document.getElementById('loan-form').addEventListener('submit', createLoan);

  loadFormOptions();
  fetchLoans(); // Inicializa a lista de empréstimos
});
