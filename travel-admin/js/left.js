document.addEventListener("DOMContentLoaded", displayUserName);

async function displayUserName() {
  try {
    const response = await fetch("http://localhost:8080/admin/username", {
      method: "GET",
      credentials: "include"
    });
    console.log(response);
    
    if (response.ok) {
      const data = await response.json();

      // You can use the data from the response or localStorage
      let adminId = localStorage.getItem('adminId');
      let username = localStorage.getItem('adminUserName');

      console.log("Fetched:", data);
      console.log("Local:", adminId, username);

      document.getElementById("login").innerText = `Hello ${username} (ID: ${adminId})`;
    } 
    else {
      document.getElementById("login").innerText = "Hello Guest";
    }
  } 
  
  catch (err) {
    console.error(err);
  }
}
