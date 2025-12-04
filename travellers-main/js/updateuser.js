const error = document.getElementById('error');

//get the user details
window.addEventListener("DOMContentLoaded",displayUserDetails);
async function displayUserDetails(){
    try{
        const response=await fetch("http://localhost:8080/user/userData",{
            method:"GET",
            credentials:"include"
        });
        const responseData=await response.json();
        document.getElementById('username').value=responseData.username;
        document.getElementById('email').value=responseData.email;
        document.getElementById('contact').value=responseData.contact;
    }
    catch(e){
        console.log(e);
        error.innerText='Error: Session Expired & Cannot fetch user details'
        error.style.color='red';
        error.style.marginLeft="200px";
        error.style.marginTop="20px";
        
    }


}


//update the user details
const form = document.getElementById('updateform');

form.addEventListener('submit', handleUpdateUser);

async function handleUpdateUser(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const contact = document.getElementById('contact').value.trim();

    const data = { username, email, contact };

    if(!username && !email && !contact){
        error.innerText = "Please provide details before submit!";
        error.style.color = 'red';
        error.style.marginTop="10px";
        error.style.marginLeft="200px";
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/user/updateUser", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        error.innerText = responseData.message;
        error.style.color = response.ok ? "green" : "red";
        error.style.marginTop = "20px";
        error.style.marginLeft="50px";

        if(response.ok){
            document.querySelector("#loginlist option[value='Login']").textContent=`Hello ${username}`;
        }

    } catch (e) {
        error.innerText = "Something went wrong..Please try again";
        error.style.color = 'red';
        console.log(e);
    }
}


//reset button
form.addEventListener('reset',()=>{
    error.innerText='';
    form.querySelectorAll('input').forEach(inp=>inp.value="");
})
