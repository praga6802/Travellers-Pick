async function displayUserName() {
  console.log("Cookies before fetch:", document.cookie);
  try {
    const response = await fetch("http://localhost:8080/admin/current-admin", {
      method: "GET",
      credentials: "include"
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      const username=data.adminUserName;
      const userNameOption=document.getElementById('usernameoption');
      userNameOption.innerText = `Hello ${username}`;
      userNameOption.value='default';
    } 
    else {
      const error=await response.json();
      console.log(error);
    }
  } 
  catch (err) {
    console.error("Error Fetching Admin Info",err);
    window.location.href="loginform.html"
  }
}

async function handleLogout(select){

  if(select.value=='logout'){
    try{
      const response=await fetch("http://localhost:8080/admin/logout",{
        method:"POST",
        credentials:"include"
      });
      if(response.ok){
        const res=await response.json();
        alert(res.message);
        window.location.href="loginform.html"
      }
      else{
        alert("Logout Failed. Try again.");
      }
    }
    catch(err){
      console.log("Logout Error: ",err);
      alert("Network error during logout");
    }
  }
  else{
    select.value='default';
  }
}

window.addEventListener("DOMContentLoaded",displayUserName);