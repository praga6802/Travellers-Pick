async function displayUserName() {
  try {
    const response = await fetch("http://localhost:8080/admin/current-admin", {
      method: "GET",
      credentials: "include"
    });
    
    if (response.ok) {
      const data = await response.json();
      const username=data['Active User'];

      const userNameOption=document.getElementById('usernameoption');
      userNameOption.innerText = `Hello ${username}`;
      userNameOption.value='default';
    } 
    else {
      alert('No Active User..Redirecting to LOGIN Page');
      window.location.href="loginform.html"
    }
  } 
  catch (err) {
    console.error("Error Fetching Admin Info",err);
    window.location.href="loginform.html"
  }
}

async function handleLogout(select){

  if(select.value=='logout'){
    await fetch("http://localhost:8080/admin/logout",{
      method:"POST",
      credentials:"include"
    });
    window.location.href='../../travel-admin/html/loginform.html';
    return;
  }
  else{
    select.value='default';
  }
}

window.addEventListener("DOMContentLoaded",displayUserName);