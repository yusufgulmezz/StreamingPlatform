fetch('http://localhost:8080/api/users/2/subscription?type=STANDARD', { method: 'PUT' })
  .then(res => res.text().then(text => console.log('STATUS:', res.status, 'BODY:', text)))
  .catch(err => console.error('ERROR:', err));
