fetch('http://localhost:5173/api/users/2/subscription?type=STANDARD', { method: 'PUT', headers: {'Content-Type': 'application/json'} })
  .then(res => res.text().then(text => console.log('STATUS:', res.status, 'BODY:', text)))
  .catch(err => console.error('ERROR:', err));
