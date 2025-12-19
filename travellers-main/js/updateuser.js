const error = document.getElementById('error');
const username=document.getElementById('username');
const email=document.getElementById('email');
const contact=document.getElementById('contact');
const form = document.getElementById('updateform');

//get the user details
window.addEventListener("DOMContentLoaded",displayUserDetails);
async function displayUserDetails(){
    try{
        const response=await fetch("http://localhost:8080/user/userData",{
            method:"GET",
            credentials:"include"
        });
        const responseData=await response.json();
        if(!response.ok){
            displayMessage(responseData.message,response.ok);
            return;
        }
        username.value=responseData.username;
        email.value=responseData.email;
        contact.value=responseData.contact;

    }
    catch(e){
        username.value='';
        email.value='';
        contact.value='';
        displayMessage('Network Error or Session Expired. Please login again!');
        form.style.display='none';
        console.log(e);
    }
}


//update the user details

form.addEventListener('submit', handleUpdateUser);

async function handleUpdateUser(event) {
    event.preventDefault();

    const updateUserName=username.value.trim();
    const  updateEmail=email.value.trim();
    const updateContact=contact.value.trim();

    const data = { username:updateUserName, email:updateEmail, contact:updateContact };

    try {
        const response = await fetch("http://localhost:8080/user/updateUser", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        if(!response.ok){
            displayMessage(responseData.message);
            form.style.display='none';
            return;
        }
        
        displayMessage(responseData.message,response.ok);
        form.style.display='block';

        if(response.ok){
            document.querySelector("#loginlist option[value='Login']").textContent=`Hello ${updateUserName}`;
        }

    } catch (e) {
        displayMessage(e.message);
        form.style.display='none';
        console.log(e);
    }
}

//display message
function displayMessage(msg,response=false){
    error.innerText=msg;
    error.style.color = response ? "green" : "red";
    error.style.marginTop = "20px";
    error.style.marginLeft="170px";
}

//reset button
form.addEventListener('reset',()=>{
    username.value='';
    email.value='';
    contact.value='';
    error.innerText='';
})
