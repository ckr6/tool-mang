document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    window.location.href = '/login.html';
  }

  const fetchAssets = () => {
    fetch('/api/assets', {
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
      const app = document.getElementById('app');
      app.innerHTML = '';
      const list = document.createElement('ul');
      list.className = "list-disc pl-5";

      data.forEach(asset => {
        const listItem = document.createElement('li');
        listItem.className = "mb-2 flex items-center";
        listItem.innerHTML = `
          ${asset.name} - ${asset.status}
          <button class="ml-4 px-2 py-1 bg-yellow-500 text-white rounded-md" onclick="editAsset(${asset.id})">Edit</button>
          <button class="ml-2 px-2 py-1 bg-red-500 text-white rounded-md" onclick="deleteAsset(${asset.id})">Delete</button>
        `;
        list.appendChild(listItem);
      });

      app.appendChild(list);
    })
    .catch(error => console.error('Error fetching assets:', error));
  };

  fetchAssets();

  document.getElementById('assetForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const status = document.getElementById('status').value;
    const location = document.getElementById('location').value;

    const response = await fetch('/api/assets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, description, status, location })
    });

    if (response.ok) {
      fetchAssets(); // Atualizar a lista de ativos após adicionar um novo
    } else {
      const data = await response.json();
      console.error(data.message);
    }
  });
});

const editAsset = (id) => {
  const token = localStorage.getItem('userToken');
  const name = prompt('Enter new name:');
  const description = prompt('Enter new description:');
  const status = prompt('Enter new status:');
  const location = prompt('Enter new location:');

  fetch(`/api/assets/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name, description, status, location })
  })
  .then(response => {
    if (response.ok) {
      fetchAssets();
    } else {
      const data = response.json();
      console.error(data.message);
    }
  })
  .catch(error => console.error('Error updating asset:', error));
};

const deleteAsset = (id) => {
  const token = localStorage.getItem('userToken');

  fetch(`/api/assets/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    if (response.ok) {
      fetchAssets();
    } else {
      const data = response.json();
      console.error(data.message);
    }
  })
  .catch(error => console.error('Error deleting asset:', error));
};
