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
        }
    } catch (err) {
        alert('Session Expired or Network Error!');
        window.location.href='../html/loginform.html';
    }
});


//add package in form
const form = document.getElementById("addpackageform");
form.addEventListener("submit", handleAddPackage);
async function handleAddPackage(event) {
    event.preventDefault();
    const packageNameInp=document.getElementById("packageName");
    const packageSloganInp=document.getElementById("packageSlogan");
    const imageFile=document.getElementById('imageFile');

    const packageName=packageNameInp.value.trim();
    const packageSlogan=packageSloganInp.value.trim();

    if (!packageName || !packageSlogan) {
        error.innerText = "Package Name and Slogan are required";
        error.style.color = "red";
        return;
    }

    if(!imageFile.files || imageFile.files.length===0){
        error.innerText='Image is required';
        error.style.color='red';
        return;
    }

    const formData= new FormData();
    formData.append("packageName",packageName);
    formData.append("packageSlogan",packageSlogan);
    formData.append("imageFile",imageFile.files[0]);

    try {
        const response = await fetch("http://localhost:8080/admin/addPackage", {
            method: "POST",
            body: formData,
            credentials:"include",
        });

        const responseData = await response.json();
        error.innerText = responseData.message;
        error.style.color = response.ok ? "green" : "red";
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
})
