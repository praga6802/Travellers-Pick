async function handlePackage() {

    try{
        const response=await fetch("http://localhost:8080/admin/allpackages");
        const data=await response.json();
        const select=document.getElementById("packages");
        select.length=1;


        data.forEach(pkg=>{
            const option=document.createElement("option");
            option.value=pkg.packageId;
            option.textContent=pkg.packageName;
            select.appendChild(option);
        });

    }
    catch(err){
        console.error("Error loading packages",err);
    }

}

document.addEventListener("DOMContentLoaded",handlePackage);