const baseUrl = "http://localhost:3000"

fetch(`${baseUrl}/users`)
.then(response => response.json())
.then(data => console.log(data))