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
        errorMsg.innerText = "Network Error..Please Try again";
        errorMsg.style.color = "red";
    }
});


//delete the tour category
const form = document.getElementById("deletecategoryform");
form.addEventListener("submit", handledeletecategory);

async function handledeletecategory(event) {
    event.preventDefault();

    const tourIdVal = document.getElementById("tourId").value.trim();
    const tourId = tourIdVal ? parseInt(tourIdVal) : null;

    if (!tourId) {
        errorMsg.innerText = "Tour ID is required!";
        errorMsg.style.color = "red";
        errorMsg.style.textAlign = "center";
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/admin/deleteCategory", {
            method: "DELETE",
            body: JSON.stringify({ tourId }),
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });

        const responseData = await response.json();
        errorMsg.innerText = responseData.message;
        errorMsg.style.color = response.ok ? "green" : "red";
        errorMsg.style.textAlign = "center";
        errorMsg.style.marginTop = "50px";

        if (response.ok) setTimeout(() => form.reset(), 1000);

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
