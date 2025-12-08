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
        const tourId = tourIdVal ? parseInt(tourIdVal) : null;
        if (!tourId) {
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
        

        if(imageFile.files.length===0 || !imageFile.files){
            errorMsg.innerText='Image is not Uploaded!';
            errorMsg.style.color='red'
            errorMsg.style.marginTop="20px";
            errorMsg.style.marginLeft="200px";
            return;
        }

        const days = daysVal !== "" ? parseInt(daysVal) : undefined;
        const nights = nightsVal !== "" ? parseInt(nightsVal) : undefined;
        const price = priceVal !== "" ? parseFloat(priceVal) : undefined;

        const data = new FormData();
        data.append('packageId',packageId);
        data.append('tourId',tourId);
        if (tourName) data.append('tourName',tourName);
        if (tourSlogan) data.append('tourSlogan', tourSlogan);
        if (places) data.append('places', places);
        if (days !== undefined) data.append('days',days);
        if (nights !== undefined) data.append('nights',nights);
        if (price !== undefined) data.append('price',price);
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
