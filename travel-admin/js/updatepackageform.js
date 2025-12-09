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
window.addEventListener("DOMContentLoaded",async function(){

    const packageId=document.getElementById("packageId");
    try{
        const response=await fetch("http://localhost:8080/admin/packageNames",{
            method:"GET",
            credentials:"include",
        });
        
        const responseData=await response.json();
        if(!response.ok){
            errorMsg.innerText=responseData.message;
            errorMsg.style.color='red';
            window.location.href='loginform.html';
        }


        if(!responseData){
            errorMsg.innerText="No Packages Found!";
            errorMsg.style.color='red';
        }
        responseData.forEach(pkg=>{
            const option=document.createElement("option");
            option.value=pkg.packageId;
            option.innerText=pkg.packageName;
            packageId.appendChild(option);
        });
    }
    catch(err){
        errorMsg.innerText = "Network error..Unable to reach Server!";
        errorMsg.style.color = "red";
    }

});


//update package in form
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
