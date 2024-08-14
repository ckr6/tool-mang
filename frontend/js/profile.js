document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      window.location.href = '/login.html';
    }
  
    fetch('/api/users/profile', {
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
      const profileDiv = document.getElementById('profile');
      profileDiv.innerHTML = `
        <p><strong>Username:</strong> ${data.username}</p>
        <p><strong>Email:</strong> ${data.email}</p>
      `;
    })
    .catch(error => console.error('Error fetching profile:', error));
  });
  