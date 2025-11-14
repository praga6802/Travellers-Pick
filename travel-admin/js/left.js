async function displayUserName() {
  try {
    const response = await fetch("http://localhost:8080/admin/current-admin", {
      method: "GET",
      credentials: "include"
    });
    
    if (response.ok) {
      const data = await response.json();
      const username=data.adminUserName;
      document.getElementById("usernameoption").innerText = `Hello ${username}`;
    } 
    else {
      window.location.href="loginform.html"
    }
  } 
  catch (err) {
    console.error("Error Fetching Admin Info",err);
    window.location.href="loginform.html"
  }
}

async function handleLogin(select){

  if(select.value=='logout'){
    await fetch("http://localhost:8080/admin/logout",{
      method:"POST",
      credentials:"include"
    });
     window.location.href='../../travellers-main/html/index.html';
      return;
  }
}

window.addEventListener("DOMContentLoaded",displayUserName);