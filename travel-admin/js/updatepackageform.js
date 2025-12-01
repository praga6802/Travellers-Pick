const error=document.getElementById("error");

// get the logged admin id
window.addEventListener("DOMContentLoaded",async()=>{
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


//add package in form
const form = document.getElementById("updatepackageform");
form.addEventListener("submit", handleUpdatePackage);
async function handleUpdatePackage(event) {
    event.preventDefault();
    const packageName=document.getElementById("packageName").value.trim();
    const packageSlogan=document.getElementById("packageSlogan").value.trim();
    const packageId=document.getElementById("packageId").value.trim();

    if (!packageId) {
        error.innerText = "Package Id is required";
        error.style.color = "red";
        return;
    }

    const data={packageId};
    if(packageName)data.packageName=packageName
    if(packageSlogan)data.packageSlogan=packageSlogan


    try {
        const response = await fetch("http://localhost:8080/admin/updatePackage", {
            method: "PUT",
            body: JSON.stringify(data),
            credentials:"include",
            headers:{
                "Content-Type":"application/json"
            },
        });

        const responseData = await response.json();
        error.innerText = responseData.message;
        error.style.color = response.ok ? "yellowgreen" : "red";
        error.style.backgroundColor="black"
        error.style.textAlign = "center";
        error.style.marginTop = "50px";
    } 
    catch (err) {
        error.innerText = "Network Error..Please Try again";
        error.style.color = 'red';
    }
}
