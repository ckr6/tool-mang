document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });
  
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('userToken', data.token);
      window.location.href = '/';
    } else {
      console.error(data.message);
    }
  });
  