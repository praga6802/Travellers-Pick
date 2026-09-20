const error = document.getElementById('error');
const form = document.getElementById("deletepackageform");
const packageName = document.getElementById("packageName");

//get the current admin
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


//get the package names to send package id
window.addEventListener("DOMContentLoaded",async function(){

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
            packageName.appendChild(option);
        });
    }
    catch(err){
        errorMsg.innerText = "Network error..Unable to reach Server!";
        errorMsg.style.color = "red";
    }

});



//delete package
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const packageId = packageName.value;

    if (!packageId) {
        error.innerText = "Please select a package to delete";
        error.style.color = "red";
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/admin/deletePackage", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ packageId })
        });

        const responseData = await response.json();
        error.innerText = responseData.message;
        error.style.color = response.ok ? "green" : "red";

        if (response.ok) {
            packageName.querySelector(`option[value="${packageId}"]`).remove();
        }

    } catch (err) {
        error.innerText = "Network error..Unable to reach server!";
        error.style.color = "red";
    }
});

form.addEventListener('reset',()=>{
    error.innerText='';
    packageIdInp.innerText='';
})