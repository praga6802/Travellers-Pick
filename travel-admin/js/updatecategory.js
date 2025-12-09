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

    //update the tour category
    const form = document.getElementById("updatecategoryform");
    form.addEventListener('submit', handleUpdateCategory);

    async function handleUpdateCategory(event) {
        event.preventDefault();

        const packageId=document.getElementById('packageName').value.trim();
        const tourIdVal = document.getElementById("tourId").value.trim();

        if (!tourIdVal) {
            errorMsg.innerText = "Tour ID is required!";
            errorMsg.style.color = "red";
            errorMsg.style.textAlign = "center";
            return;
        }
        const tourName = document.getElementById("tourName").value.trim();
        const tourSlogan = document.getElementById("tourSlogan").value.trim();
        const places = document.getElementById("places").value.trim();
        const daysVal = document.getElementById("days").value.trim();
        const nightsVal = document.getElementById("nights").value.trim();
        const priceVal = document.getElementById("price").value.trim();
        const imageFile=document.getElementById('imageFile');
    

        const data = new FormData();
        data.append('packageId',packageId);
        data.append('tourId',parseInt(tourIdVal));
        if (tourName) data.append('tourName',tourName);
        if (tourSlogan) data.append('tourSlogan', tourSlogan);
        if (places) data.append('places', places);
        if (daysVal) data.append('days',parseInt(daysVal));
        if (nightsVal) data.append('nights',parseInt(nightsVal));
        if (priceVal) data.append('price',parseInt(priceVal));
        if(imageFile.files && imageFile.files.length>0)data.append('imageFile',imageFile.files[0]);

        try {
            const response = await fetch("http://localhost:8080/admin/updateCategory", {
                method: "POST",
                body: data,
                credentials: "include"
            });

            const responseData = await response.json();
            errorMsg.innerText = responseData.message;
            errorMsg.style.color = response.ok ? "green" : "red";
            errorMsg.style.textAlign = "center";
            errorMsg.style.marginTop = "50px";
        } catch (err) {
            errorMsg.innerText = "Network Error.. Please try again";
            errorMsg.style.color = "red";
            console.error(err);
        }
    }
    form.addEventListener('reset',()=>{
        errorMsg.innerText='';
    })
