async function displayUserName() {
  console.log("Cookies before fetch:", document.cookie);
  try {
    const response = await fetch("http://localhost:8080/admin/adminData", {
      method: "GET",
      credentials: "include"
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      const username=data.username;
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
        alert('Error: Session Expired & Cannot fetch user details');
        console.log(err);
    }
  }
  else{
    select.value='default';
  }
}

window.addEventListener("DOMContentLoaded",displayUserName);