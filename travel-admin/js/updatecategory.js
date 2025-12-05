
//get the admin detail
const errorMsg = document.getElementById("error");
window.addEventListener('DOMContentLoaded', async () => {
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
            errorMsg.style.color = "red";
            errorMsg.innerText = "Unable to fetch admin details";
            window.location.href="loginform.html";
        }
    } catch (err) {
        event.preventDefault();
        error.innerText='Error: Session Expired & Cannot fetch user details'
        error.style.color='red';
        error.style.marginLeft="200px";
        error.style.marginTop="20px";
        console.log(err);
    }
});


//update the tour category
const form = document.getElementById("updatecategoryform");
form.addEventListener('submit', handleUpdateCategory);

async function handleUpdateCategory(event) {
    event.preventDefault();

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

    const days = daysVal !== "" ? parseInt(daysVal) : undefined;
    const nights = nightsVal !== "" ? parseInt(nightsVal) : undefined;
    const price = priceVal !== "" ? parseFloat(priceVal) : undefined;

    const data = { tourId };
    if (tourName) data.tourName = tourName;
    if (tourSlogan) data.tourSlogan = tourSlogan;
    if (places) data.places = places;
    if (days !== undefined) data.days = days;
    if (nights !== undefined) data.nights = nights;
    if (price !== undefined) data.price = price;

    try {
        const response = await fetch("http://localhost:8080/admin/updateCategory", {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
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
    error.innerText='';
    form.querySelectorAll('input').forEach(inp=>inp.value="");
})
