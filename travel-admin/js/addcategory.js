// get the package names

const errorMsg=document.getElementById("error");

window.addEventListener("DOMContentLoaded",async function(){

    const packageName=document.getElementById("packageName");
    try{
        const response=await fetch("http://localhost:8080/admin/packageNames",{
            method:"GET",
            credentials:"include",
        });

        if(!response.ok){
            errorMsg.innerText="Internal Server Error";
            errorMsg.style.color='red';
            window.location.href='loginform.html';
        }

        const responseData=await response.json();

        responseData.forEach(pkg=>{
            const option=document.createElement("option");
            option.value=pkg.packageId;
            option.innerText=pkg.packageName;
            packageName.appendChild(option);
        });
    }
    catch(err){
        errorMsg.innerText = "Network error. Please try again.";
        errorMsg.style.color = "red";
    }

});


//add category to the package
const form=document.getElementById("addcategoryform");
form.addEventListener('submit',handledaddcategory);

async function handledaddcategory(event) {
    event.preventDefault();
    const packageId = parseInt(document.getElementById("packageName").value.trim());
    const tourName = document.getElementById("tourName").value.trim();
    const tourSlogan = document.getElementById("tourSlogan").value.trim();
    const places = document.getElementById("places").value.trim();
    const days = parseInt(document.getElementById("days").value.trim());
    const nights = parseInt(document.getElementById("nights").value.trim());
    const price = parseFloat(document.getElementById("price").value.trim());

    if (isNaN(packageId) || isNaN(days) || isNaN(nights) || isNaN(price)) {
        errorMsg.innerText = "Please fill all fields with valid numbers";
        errorMsg.style.color = "red";
        return;
    }

    const data = { packageId, tourName, tourSlogan, places, days, nights, price };
    try {
    const response = await fetch("http://localhost:8080/admin/addCategory", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-Type":"application/json"},
        credentials: "include"
    });

    const responseData = await response.json();
    errorMsg.innerText = responseData.message;
    errorMsg.style.color = response.ok ? "green" : "red";
    errorMsg.style.textAlign = "center";
    errorMsg.style.marginTop = "50px";
    } 
    catch(err) {
        event.preventDefault(); // ensure form doesn’t submit
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
