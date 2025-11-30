async function displayUserName(){
    try{
        const response= await fetch("http://localhost:8080/user/current-user",{
            method:"GET",
            credentials:"include"
        });

        if(response.ok){
            const data=await response.json();
            document.querySelector("#loginlist option[value='Login']").textContent=`Hello ${data.userName}`;

            let userOption= document.getElementById('user');
            userOption.textContent="Logout";
            userOption.value='logout';
            
            document.getElementById('admin').style.display="none";
        
        }
        else{
            console.log("User not found ");
        }
    }
    catch(err){
        console.log("Error fetching User Info");
    }
}


// INDEX Login option
async function goLogin(value){
    if(value=='user')window.location.href="../html/login.html";

    else if(value=='logout'){
        await fetch("http://localhost:8080/user/logout",{ //logout
            method:"POST",
            credentials:"include"
        });
        setTimeout(()=>window.location.href='../html/index.html',1000);
        return;
    }
    else window.location.href="../../travel-admin/html/loginform.html" //admin logout
}

window.addEventListener("DOMContentLoaded",displayUserName);

