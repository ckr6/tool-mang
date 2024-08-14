document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  let currentPage = 1;

  const fetchAssets = (query = '', page = 1) => {
    const statusFilter = document.getElementById('filter-status').value;
    const categoryFilter = document.getElementById('filter-category').value;

    const url = new URL('/api/assets', window.location.origin);
    url.searchParams.append('search', query);
    url.searchParams.append('page', page);
    if (statusFilter) {
      url.searchParams.append('status', statusFilter);
    }
    if (categoryFilter) {
      url.searchParams.append('category', categoryFilter);
    }

    console.log('Fetching assets with URL:', url.toString());

    fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      const assetList = document.getElementById('asset-list');
      assetList.innerHTML = '';
      if (data && data.length > 0) {
        data.forEach(asset => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td class="border px-4 py-2">${asset.name}</td>
            <td class="border px-4 py-2">${asset.description}</td>
            <td class="border px-4 py-2">${asset.location}</td>
            <td class="border px-4 py-2">${asset.status}</td>
            <td class="border px-4 py-2">${new Date(asset.updatedAt).toLocaleString()}</td>
            <td class="border px-4 py-2">${asset.category ? asset.category.name : 'Sem categoria'}</td>
            <td class="border px-4 py-2">
              <button onclick="viewAsset(${asset.id})" class="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md">Visualizar</button>
              <button onclick="editAsset(${asset.id})" class="mr-2 px-4 py-2 bg-yellow-500 text-white rounded-md">Editar</button>
              <button onclick="deleteAsset(${asset.id})" class="px-4 py-2 bg-red-500 text-white rounded-md">Excluir</button>
            </td>
          `;
          assetList.appendChild(row);
        });
      } else {
        assetList.innerHTML = '<tr><td colspan="7" class="text-center">Nenhum ativo encontrado</td></tr>';
      }

      const pagination = document.getElementById('pagination');
      pagination.innerHTML = '';
      for (let i = 1; i <= data.pages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.className = `px-3 py-1 mx-1 ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300'}`;
        pageButton.addEventListener('click', () => {
          currentPage = i;
          fetchAssets(query, i);
        });
        pagination.appendChild(pageButton);
      }
    })
    .catch(error => console.error('Erro ao buscar ativos:', error));
  };

  const fetchCategories = () => {
    return fetch('/api/categories', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(categories => {
      const categorySelect = document.getElementById('filter-category');
      categorySelect.innerHTML = '<option value="">Todas as Categorias</option>';
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });

      const assetCategorySelect = document.getElementById('category-select');
      assetCategorySelect.innerHTML = '<option value="" disabled selected>Selecione a Categoria</option>';
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        assetCategorySelect.appendChild(option);
      });
      return categories;
    })
    .catch(error => console.error('Erro ao buscar categorias:', error));
  };

  document.getElementById('search').addEventListener('input', event => {
    const query = event.target.value;
    fetchAssets(query, currentPage);
  });

  document.getElementById('filter-status').addEventListener('change', () => {
    fetchAssets('', currentPage);
  });

  document.getElementById('filter-category').addEventListener('change', () => {
    fetchAssets('', currentPage);
  });

  document.getElementById('add-asset-btn').addEventListener('click', () => {
    document.getElementById('modal-title').innerText = 'Cadastrar Ativo';
    document.getElementById('asset-form').reset();
    document.getElementById('asset-id').value = '';
    document.getElementById('category-fields').innerHTML = '';
    document.body.classList.add('modal-open');
    document.getElementById('asset-modal').classList.remove('hidden');
  });

  document.getElementById('cancel-btn').addEventListener('click', () => {
    document.body.classList.remove('modal-open');
    document.getElementById('asset-modal').classList.add('hidden');
  });

  document.getElementById('category-select').addEventListener('change', event => {
    const categoryId = event.target.value;
    fetch(`/api/categories/${categoryId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar categoria');
      }
      return response.json();
    })
    .then(category => {
      const categoryFieldsContainer = document.getElementById('category-fields');
      categoryFieldsContainer.innerHTML = '';
      if (category && category.fields) {
        category.fields.forEach(field => {
          const fieldContainer = document.createElement('div');
          fieldContainer.className = 'mb-4 flex items-center';

          const label = document.createElement('label');
          label.className = 'block text-gray-700 w-1/4 text-right pr-2'; 
          label.innerText = `${field.charAt(0).toUpperCase() + field.slice(1)}: `;

          const input = document.createElement('input');
          input.type = 'text';
          input.className = 'mt-1 block w-1/2 border rounded p-2';
          input.placeholder = field;
          input.name = field;

          fieldContainer.appendChild(label);
          fieldContainer.appendChild(input);
          categoryFieldsContainer.appendChild(fieldContainer);
        });
      }
    })
    .catch(error => console.error('Erro ao buscar categoria:', error));
  });

  document.getElementById('asset-form').addEventListener('submit', event => {
    event.preventDefault();
    const id = document.getElementById('asset-id').value;
    const name = document.getElementById('asset-name').value;
    const description = document.getElementById('asset-description').value;
    const location = document.getElementById('asset-location').value;
    const status = document.getElementById('asset-status').value;
    const categoryId = document.getElementById('category-select').value;

    if (!name || !description || !location || !status || !categoryId) {
      alert('Todos os campos obrigatórios devem ser preenchidos!');
      return;
    }

    const categoryFields = Array.from(document.getElementById('category-fields').querySelectorAll('input')).reduce((acc, input) => {
      if (!input.value) {
        alert(`O campo ${input.placeholder} é obrigatório!`);
        throw new Error(`O campo ${input.placeholder} é obrigatório!`);
      }
      acc[input.name] = input.value;
      return acc;
    }, {});

    const data = {
      name,
      description,
      location,
      status,
      categoryId,
      categoryFields
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/assets/${id}` : '/api/assets';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      const assetModal = document.getElementById('asset-modal');
      if (assetModal) {
        document.body.classList.remove('modal-open');
        assetModal.classList.add('hidden');
      }
      fetchAssets();
      alert('Ativo salvo com sucesso!');
    })
    .catch(error => {
      console.error('Erro ao salvar ativo:', error);
      alert('Erro ao salvar ativo!');
    });
  });

  document.getElementById('add-category-btn').addEventListener('click', () => {
    const categoryModalTitle = document.getElementById('category-modal-title');
    const categoryForm = document.getElementById('category-form');
    const fieldsContainer = document.getElementById('fields-container');
    const categoryModal = document.getElementById('category-modal');

    if (!categoryModalTitle || !categoryForm || !fieldsContainer || !categoryModal) {
      console.error('Um ou mais elementos do modal de categorias não foram encontrados');
      return;
    }

    categoryModalTitle.innerText = 'Cadastrar Categoria';
    categoryForm.reset();
    fieldsContainer.innerHTML = `
      <div class="mb-4 flex items-center">
        <label class="block text-gray-700 w-1/4 text-right pr-2">Nome do Campo:</label>
        <input type="text" class="mt-1 block w-1/2 border rounded p-2" placeholder="Nome do Campo" required>
      </div>
    `;
    document.body.classList.add('modal-open');
    categoryModal.classList.remove('hidden');
  });

  document.getElementById('cancel-category-btn').addEventListener('click', () => {
    const categoryModal = document.getElementById('category-modal');
    if (categoryModal) {
      document.body.classList.remove('modal-open');
      categoryModal.classList.add('hidden');
    } else {
      console.error('Elemento category-modal não encontrado');
    }
  });

  document.getElementById('add-field').addEventListener('click', () => {
    const fieldsContainer = document.getElementById('fields-container');
    if (fieldsContainer) {
      const fieldContainer = document.createElement('div');
      fieldContainer.className = 'mb-4 flex items-center';

      const label = document.createElement('label');
      label.className = 'block text-gray-700 w-1/4 text-right pr-2';
      label.innerText = 'Nome do Campo:';

      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'mt-1 block w-1/2 border rounded p-2';
      input.placeholder = 'Nome do Campo';
      input.required = true;

      fieldContainer.appendChild(label);
      fieldContainer.appendChild(input);
      fieldsContainer.appendChild(fieldContainer);
    } else {
      console.error('Elemento fields-container não encontrado');
    }
  });

  document.getElementById('category-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('category-name').value;
    const fields = Array.from(document.getElementById('fields-container').querySelectorAll('input')).map(input => input.value);

    if (!name || fields.some(field => !field)) {
      alert('Todos os campos da categoria devem ser preenchidos!');
      return;
    }

    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, fields })
    });

    if (response.ok) {
      fetchCategories();
      const categoryModal = document.getElementById('category-modal');
      if (categoryModal) {
        document.body.classList.remove('modal-open');
        categoryModal.classList.add('hidden');
      } else {
        console.error('Elemento category-modal não encontrado');
      }
      alert('Categoria salva com sucesso!');
    } else {
      alert('Erro ao salvar categoria!');
    }
  });

  window.viewAsset = (id) => {
    fetch(`/api/assets/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar ativo');
      }
      return response.json();
    })
    .then(data => {
      if (!data) {
        throw new Error('Ativo não encontrado');
      }

      const modalContent = document.getElementById('view-modal-content');
      modalContent.innerHTML = `
        <h2 class="text-xl font-bold mb-4">Detalhes do Ativo</h2>
        <p><strong>Nome:</strong> ${data.name}</p>
        <p><strong>Descrição:</strong> ${data.description}</p>
        <p><strong>Localização:</strong> ${data.location}</p>
        <p><strong>Status:</strong> ${data.status}</p>
        <p><strong>Última Atualização:</strong> ${new Date(data.updatedAt).toLocaleString()}</p>
        <p><strong>Categoria:</strong> ${data.category ? data.category.name : 'Não definida'}</p>
      `;

      // Campos adicionais da categoria
      if (data.categoryFields) {
        Object.keys(data.categoryFields).forEach(field => {
          const fieldElement = document.createElement('p');
          fieldElement.innerHTML = `<strong>${field}:</strong> ${data.categoryFields[field]}`;
          modalContent.appendChild(fieldElement);
        });
      }

      document.body.classList.add('modal-open');
      document.getElementById('view-modal').classList.remove('hidden');
    })
    .catch(error => console.error('Erro ao buscar ativo:', error));
  };

  document.getElementById('close-view-modal-btn').addEventListener('click', () => {
    document.body.classList.remove('modal-open');
    document.getElementById('view-modal').classList.add('hidden');
  });

  window.editAsset = (id) => {
    fetch(`/api/assets/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar ativo');
      }
      return response.json();
    })
    .then(data => {
      if (!data) {
        throw new Error('Ativo não encontrado');
      }
      document.getElementById('modal-title').innerText = 'Editar Ativo';
      document.getElementById('asset-id').value = data.id;
      document.getElementById('asset-name').value = data.name;
      document.getElementById('asset-description').value = data.description;
      document.getElementById('asset-location').value = data.location;
      document.getElementById('asset-status').value = data.status;
      document.getElementById('category-select').value = data.categoryId;
      const categoryFieldsContainer = document.getElementById('category-fields');
      categoryFieldsContainer.innerHTML = '';
      if (data.categoryFields) {
        Object.keys(data.categoryFields).forEach(field => {
          const fieldContainer = document.createElement('div');
          fieldContainer.className = 'mb-4 flex items-center';

          const label = document.createElement('label');
          label.className = 'block text-gray-700 w-1/4 text-right pr-2';
          label.innerText = `${field.charAt(0).toUpperCase() + field.slice(1)}: `;

          const input = document.createElement('input');
          input.type = 'text';
          input.className = 'mt-1 block w-1/2 border rounded p-2';
          input.placeholder = field;
          input.name = field;
          input.value = data.categoryFields[field];

          fieldContainer.appendChild(label);
          fieldContainer.appendChild(input);
          categoryFieldsContainer.appendChild(fieldContainer);
        });
      }
      document.body.classList.add('modal-open');
      document.getElementById('asset-modal').classList.remove('hidden');
    })
    .catch(error => console.error('Erro ao buscar ativo:', error));
  };

  window.deleteAsset = (id) => {
    if (!confirm('Tem certeza que deseja excluir este ativo?')) {
      return;
    }
    fetch(`/api/assets/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(() => fetchAssets())
    .catch(error => console.error('Erro ao excluir ativo:', error));
  };

  fetchAssets();
  fetchCategories();
});
