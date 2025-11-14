window.addEventListener('DOMContentLoaded', async () => {
    const input = document.getElementById("adminId");
    const error = document.getElementById('update-status');

    try {
        const response = await fetch("http://localhost:8080/admin/current-admin", {
            method: "GET",
            credentials: "include"
        });

        if (response.ok) {
            const data = await response.json();
            input.value = data.adminId; // show logged-in admin ID
        } else {
            error.innerText = "Failed to fetch admin details";
            error.style.color = "red";
        }
    } catch (err) {
        error.innerText = "Network Error..Please Try again";
        error.style.color = "red";
    }
});


const form=document.getElementById("updateAdmin");
form.addEventListener('submit',handleUpdateAdmin);
async function handleUpdateAdmin(event){
    event.preventDefault();

    const username=document.getElementById("username").value.trim();
    const email=document.getElementById("email").value.trim();
    const contact=document.getElementById("contact").value.trim();
    const password=document.getElementById('password').value.trim();

    if(!password){
        error.innerText='Password is required to update details';
        error.style.color='red';
        return;
    }


    const data={
        password
    };

    if(username)data.username=username;
    if(email)data.email=email;
    if(contact)data.contact=contact;
    

    try{

        const response=await fetch("http://localhost:8080/admin/updateadmin",{
            body:JSON.stringify(data),
            headers:{
                'Content-Type':"application/json"
            },
            method:"POST",
            credentials:"include"
        });
        const data=await response.json();
        if(response.ok){
            error.innerText=data;
            error.style.color='green';
        }
        else{
            error.innerText='Invalid Credentials';
            error.style.color='red';
        }
        setTimeout(()=>form.reset(),3000);
        error.style.textAlign='center';
        error.style.marginTop="50px";
    }

    catch(err){
        error.innerText="Network Error..Please Try again";
        error.style.color='red';

    }
}


