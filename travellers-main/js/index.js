async function displayUserName(){
    try{
        const response= await fetch("http://localhost:8080/user/current-user",{
            method:"GET",
            credentials:"include"
        });

        if(response.ok){
            const data=await response.json();
            document.querySelector("#loginlist option[value='Login']").textContent=`Hello ${data.userName}`;
                   
            let user= document.getElementById('user');
            user.innerText='User Profile';
            user.value='userProfile';
            
            let admin=document.getElementById('admin');
            admin.textContent="Logout";
            admin.value='logout';
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
    if(value=='user')window.location.href="../html/index.html";

    else if(value=='userProfile') setTimeout(()=>window.location.href='../html/userprofile.html',1000);

    else if(value=='logout'){
        await fetch("http://localhost:8080/user/logout",{ //logout
            method:"POST",
            credentials:"include"
        });
        setTimeout(()=>window.location.href='../html/index.html',1000);
        return;
    }
}

window.addEventListener("DOMContentLoaded",displayUserName);

