document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      window.location.href = '/login.html';
      return;
    }
  
    const fetchTickets = () => {
      fetch('/api/tickets', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const ticketList = document.getElementById('ticket-list');
        ticketList.innerHTML = '';
        data.forEach(ticket => {
          const item = document.createElement('div');
          item.className = 'mb-4 p-4 bg-white shadow-md rounded-md';
          item.innerHTML = `
            <h2 class="text-xl font-bold">Ticket #${ticket.id}</h2>
            <p>Descrição: ${ticket.description}</p>
            <p>Prioridade: ${ticket.priority}</p>
            <p>Status: ${ticket.status}</p>
            <button onclick="updateTicketStatus(${ticket.id}, 'Em Progresso')" class="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-md">Em Progresso</button>
            <button onclick="updateTicketStatus(${ticket.id}, 'Concluído')" class="mt-2 px-4 py-2 bg-green-500 text-white rounded-md">Concluído</button>
          `;
          ticketList.appendChild(item);
        });
      })
      .catch(error => console.error('Erro ao buscar tickets:', error));
    };
  
    document.getElementById('createTicketForm').addEventListener('submit', event => {
      event.preventDefault();
      const userId = document.getElementById('userId').value;
      const assetId = document.getElementById('assetId').value;
      const description = document.getElementById('description').value;
      const priority = document.getElementById('priority').value;
      fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, assetId, description, priority })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        fetchTickets();
        document.getElementById('createTicketForm').reset();
      })
      .catch(error => console.error('Erro ao criar ticket:', error));
    });
  
    const updateTicketStatus = (id, status) => {
      fetch(`/api/tickets/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        fetchTickets();
      })
      .catch(error => console.error('Erro ao atualizar status do ticket:', error));
    };
  
    fetchTickets();
  
    window.updateTicketStatus = updateTicketStatus; // Tornar a função disponível globalmente
  });
  