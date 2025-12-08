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
        alert('Error: Session Expired & Cannot fetch user details');
        return;
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
    const imageFile=document.getElementById('imageFile');

    if (!packageId) {
        error.innerText = "Package Id is required";
        error.style.color = "red";
        return;
    }

    const data= new FormData();
    data.append("packageId",packageId);
    if(packageName)data.append("packageName",packageName);
    if(packageSlogan)data.append("packageSlogan",packageSlogan);
    if(imageFile.files && imageFile.files.length>0)data.append("imageFile",imageFile.files[0]);


    try {
        const response = await fetch("http://localhost:8080/admin/updatePackage", {
            method: "POST",
            body: data,
            credentials:"include",
        });

        const responseData = await response.json();
        error.innerText = responseData.message;
        error.style.color = response.ok ? "green" : "red";
        error.style.textAlign = "center";
        error.style.marginTop = "50px";
    } 
    catch (err) {
        error.innerText = "Network Error..Please Try again";
        error.style.color = 'red';
    }
}
form.addEventListener('reset',()=>{
    error.innerText='';
})
