const error = document.getElementById('error');

window.addEventListener('DOMContentLoaded', async () => {
    const input = document.getElementById("adminId");

    try {
        const response = await fetch("http://localhost:8080/admin/current-admin", {
            method: "GET",
            credentials: "include"
        });

        if (response.ok) {
            const data = await response.json();
            input.value = data.adminId;
        } else {
            error.style.color = "red";
            error.innerText = "Unable to fetch admin details";
            window.location.href="loginform.html";
        }
    } catch (err) {
        error.innerText = "Network Error..Please Try again";
        error.style.color = "red";
    }
});

// update admin
const form = document.getElementById("deletepackageform");
form.addEventListener('submit', handleDeletePackage);

async function handleDeletePackage(event) {
    event.preventDefault();
    const packageId=document.getElementById("packageId").value.trim();

    try {
        const response = await fetch("http://localhost:8080/admin/deletePackage", {
            method: "DELETE",
            headers: { 'Content-Type': "application/json" },
            credentials: "include",
            body: JSON.stringify({packageId})
        });

        const responseData = await response.json();
        console.log(responseData);
        
        error.innerText=responseData.message;
        error.style.color=response.ok?"green":"red";
        error.style.textAlign = "center";
        error.style.marginTop = "50px";
    } catch (err) {
        event.preventDefault();
        error.innerText='Error: Session Expired & Cannot fetch user details'
        error.style.color='red';
        error.style.marginLeft="200px";
        error.style.marginTop="20px";
        console.log(err);
    }
}

form.addEventListener('reset',()=>{
    error.innerText='';
    form.querySelectorAll('input').forEach(inp=>inp.value="");
})
