const baseUrl = "http://localhost:3000/api/v1"

fetch(`${baseUrl}/users/12`)
.then(response => response.json())
.then(data => console.log(data))