document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    window.location.href = '/login.html';
    return; // Adicione o return para evitar que o restante do código seja executado
  }

  // Função para buscar usuários e renderizar na lista
  const fetchUsers = () => {
    fetch('/api/users', {
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
      const userList = document.getElementById('user-list');
      userList.innerHTML = '';
      if (data.length === 0) {
        userList.innerHTML = '<p>No users found.</p>';
      } else {
        const list = document.createElement('ul');
        list.className = "list-disc pl-5";

        data.forEach(user => {
          const listItem = document.createElement('li');
          listItem.className = "mb-2 flex items-center";
          listItem.innerHTML = `
            ${user.username} - ${user.email}
            <button class="ml-4 px-2 py-1 bg-red-500 text-white rounded-md" onclick="deleteUser(${user.id})">Delete</button>
          `;
          list.appendChild(listItem);
        });

        userList.appendChild(list);
      }
    })
    .catch(error => console.error('Error fetching users:', error));
  };

  // Função para deletar um usuário
  const deleteUser = (id) => {
    fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.ok) {
        fetchUsers(); // Recarrega a lista de usuários após a exclusão
      } else {
        return response.json().then(data => {
          console.error(data.message);
        });
      }
    })
    .catch(error => console.error('Error deleting user:', error));
  };

  window.deleteUser = deleteUser; // Torna a função deleteUser disponível globalmente

  // Inicializa a lista de usuários ao carregar a página
  fetchUsers();
});
