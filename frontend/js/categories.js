document.addEventListener('DOMContentLoaded', () => {
    const addFieldButton = document.getElementById('add-field');
    const fieldsContainer = document.getElementById('fields-container');
    const categoryForm = document.getElementById('category-form');
    const categoryList = document.getElementById('categories-list');

    addFieldButton.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'input-field';
        input.placeholder = 'Nome do Campo';
        fieldsContainer.appendChild(input);
    });

    categoryForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('category-name').value;
        const fields = Array.from(fieldsContainer.querySelectorAll('input')).map(input => input.value);

        const response = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, fields })
        });

        if (response.ok) {
            fetchCategories();
            categoryForm.reset();
            fieldsContainer.innerHTML = '<input type="text" class="input-field" placeholder="Nome do Campo">';
        }
    });

    async function fetchCategories() {
        const response = await fetch('/api/categories');
        const categories = await response.json();
        categoryList.innerHTML = '';
        categories.forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'mb-2';
            categoryElement.innerHTML = `
                <h2 class="font-bold">${category.name}</h2>
                <ul>
                    ${category.fields.map(field => `<li>${field}</li>`).join('')}
                </ul>
            `;
            categoryList.appendChild(categoryElement);
        });
    }

    fetchCategories();
});
