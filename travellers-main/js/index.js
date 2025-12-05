async function displayUserName(){
    try{
        const response= await fetch("http://localhost:8080/user/userData",{
            method:"GET",
            credentials:"include"
        });

        if(response.ok){
            const data=await response.json();
            document.querySelector("#loginlist option[value='Login']").textContent=`Hello ${data.username}`;
            let user= document.getElementById('user');
            user.innerText='User Profile';
            user.value='userProfile';

            let logout=document.getElementById('admin');
            logout.textContent="Logout";
            logout.value='logout';
        }
        else{
            console.log("User not found");
        }
    }
    catch(err){
        error.innerText='Network Error or Session Expired. Please login again!'
        error.style.color='red';
        error.style.marginLeft="200px";
        error.style.marginTop="20px";
    }
}


// INDEX Login option
async function goLogin(value) {
    switch(value) {
        case 'user':
            window.location.href = "../html/login.html";
            break;

        case 'userProfile':
            alert("Redirecting to your profile...");
            setTimeout(() => window.location.href = '../html/userprofile.html', 1000);
            break;

        case 'admin':
            alert("Redirecting to admin login...");
            window.location.href = '../../travel-admin/html/loginform.html';
            break;

        case 'logout':
            try {
                const response = await fetch("http://localhost:8080/user/logout", {
                    method: "POST",
                    credentials: "include"
                });
                if (response.ok) {
                    alert("Logged out successfully!");
                    setTimeout(() => window.location.href = '../html/index.html', 1000);
                } else {
                    console.error("Logout failed");
                }
            } catch(err) {
                console.error("Error logging out:", err);
            }
            break;

        default:
            console.log("No action for selected value");
    }
}


window.addEventListener("DOMContentLoaded",displayUserName);

