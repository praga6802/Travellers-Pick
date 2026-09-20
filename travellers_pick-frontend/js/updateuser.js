const error = document.getElementById('error');
const username=document.getElementById('username');
const email=document.getElementById('email');
const contact=document.getElementById('contact');
const form = document.getElementById('updateform');

let oldEmail,oldContact,oldUsername;

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
        oldEmail=responseData.email;
        email.value=responseData.email;

        oldUsername=responseData.username;
        username.value=responseData.username;


        oldContact=responseData.contact;
        contact.value=responseData.contact;

    }
    catch(e){
        username.value='';
        email.value='';
        contact.value='';
        displayMessage('Network Error or Session Expired. Please login again!');
        form.style.display='none';
        setTimeout(()=>{window.location.href='../html/login.html'},1500);
    }
}


//update the user details

form.addEventListener('submit', handleUpdateUser);

async function handleUpdateUser(event) {
    event.preventDefault();

    const updateUserName=username.value.trim();
    const updateEmail=email.value.trim();
    const updateContact=contact.value.trim();



    const data = {};
    if(updateUserName)data.username=updateUserName;
    if(updateEmail)data.email=updateEmail;
    if(updateContact)data.contact=updateContact;

    try {
        const response = await fetch("http://localhost:8080/user/updateUser", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        displayMessage(responseData.message,response.ok);
        form.style.display='block';

        
        if(!response.ok){
            displayMessage(responseData.message);
            return;
        }

        if(updateEmail!=oldEmail && updateUserName==oldUsername && updateContact==oldContact){
            displayMessage(responseData.message,response.ok);
            setTimeout(()=>{window.location.href='../html/verifyotp.html'},1500);
            return;
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
