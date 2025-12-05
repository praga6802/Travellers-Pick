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
const form = document.getElementById("addpackageform");
form.addEventListener("submit", handleAddPackage);
async function handleAddPackage(event) {
    event.preventDefault();
    const packageNameInp=document.getElementById("packageName");
    const packageSloganInp=document.getElementById("packageSlogan");

    const packageName=packageNameInp.value.trim();
    const packageSlogan=packageSloganInp.value.trim();
    if (!packageName || !packageSlogan) {
        error.innerText = "Package Name and Slogan are required";
        error.style.color = "red";
        return;
    }

    const data={packageName,packageSlogan};

    try {
        const response = await fetch("http://localhost:8080/admin/addPackage", {
            method: "POST",
            body: JSON.stringify(data),
            credentials:"include",
            headers:{
                "Content-Type":"application/json"
            },
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
    form.querySelectorAll('input').forEach(inp=>inp.value="");
})
