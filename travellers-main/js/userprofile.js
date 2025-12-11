//login in option
const login=document.getElementById('login-btn');
if(login){
    login.value='login';
    login.addEventListener('click',goLogin);
}


//signin in option
const signin=document.getElementById('signin-btn');
if(signin){
    signin.addEventListener('click',()=>{
    window.location.href='../html/signup.html';
});
}


//after login, display the current user
async function displayUserName(){
    try{
        const response= await fetch("http://localhost:8080/user/userData",{
            method:"GET",
            credentials:"include"
        });
    
        if(response.ok){
            const data=await response.json();

            const loginSelect=document.createElement('select');
            loginSelect.id='loginSelect'
            loginSelect.innerHTML = '';

            const greeting = document.createElement('option');
            greeting.className='loginoption';
            greeting.textContent = `Hello ${data.username}!`;
            greeting.value=`Hello ${data.username}`;
            loginSelect.appendChild(greeting);
            
            const logoutOption = document.createElement('option');
            logoutOption.className='loginoption';
            logoutOption.value = 'logout';
            logoutOption.textContent = 'Logout';
            loginSelect.appendChild(logoutOption);

            const loginbtn = document.getElementById('login-btn');
            if (loginbtn) {
                loginbtn.replaceWith(loginSelect);
                loginSelect.addEventListener('change', goLogin);
            }

            //sign in not shown
            const signin=document.getElementById('signin-btn');
            if(signin)signin.style.display='none';
        }
    }
    catch(err){
        alert('Network Error or Session Expired. Please login again!');
        console.log(err);
    }
}




// INDEX Login option
async function goLogin(e) {
    const value=e.target.value;
    switch(value) {
        case 'login':
            window.location.href = "../html/login.html";
            break;

        case 'logout':
            try {
                const response = await fetch("http://localhost:8080/user/logout", {
                    method: "POST",
                    credentials: "include"
                });
                if (response.ok) {
                    alert("Logged out successfully!");
                    window.location.href = '../html/index.html';
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

