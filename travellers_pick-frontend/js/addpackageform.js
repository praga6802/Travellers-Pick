const error = document.getElementById('error');

window.addEventListener('DOMContentLoaded', async () => {

    try {
        const response = await fetch("http://localhost:8080/admin/current-admin", {
            method: "GET",
            credentials: "include"
        });

        if(!response.ok){
            alert('Session Expired or Network Error..Please try again!');
            window.location.href='../html/loginform.html';
        }

    } catch (err) {
        error.innerText = "Network Error..Please Try again";
        error.style.color = "red";
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
    const packageCodeInp=document.getElementById('packageCode');

    const packageName=packageNameInp.value.trim();
    const packageSlogan=packageSloganInp.value.trim();
    const packageCode=packageCodeInp.value.trim();

    if(!packageName)displayMessage('Package name is required!');
    if(!packageSlogan)displayMessage('Package Slogan is required');
    if(!packageCode) displayMessage('Package Code is required!');
    if(!imageFile.files || imageFile.files.length===0)displayMessage('Image is required!');

    const formData= new FormData();
    formData.append("packageName",packageName);
    formData.append("packageSlogan",packageSlogan);
    formData.append('packageCode',packageCode);
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

function displayMessage(msg){
    error.innerText=msg;
    error.style.color = "red";
    return;
}