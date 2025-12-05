const error = document.getElementById('error');

//get the user data
window.addEventListener("DOMContentLoaded",displayUserDetails);
async function displayUserDetails(){
    try{
        const response=await fetch("http://localhost:8080/user/userData",{
            method:"GET",
            credentials:"include"
        });
        const responseData=await response.json();

        if(!response.ok){
            console.log("logged User");
            return;
        }
    }
    catch(e){
        displayMessage('Network Error or Session Expired. Please login again!');
        console.log(e);
    }
}


//cancel form
const form = document.getElementById('cancelform');
form.addEventListener('submit', handleCancel);
async function handleCancel(event) {
    event.preventDefault();
    const tourId = parseInt(document.getElementById('tourId').value.trim());
    if (isNaN(tourId)) {
            displayMessage("Please provide Tour ID to cancel booking!");
            return;
    }

    try {
        const response = await fetch("http://localhost:8080/user/cancelTour", {
            method: "DELETE",
            credentials: 'include',
            body: JSON.stringify({ tourId }),
            headers: { "Content-Type": "application/json" }
        });
        
        const responseData = await response.json();
        
        if(response.status===401){
            displayMessage(responseData.message);
            return;
        }

        displayMessage(responseData.message, response.ok);

    } catch (e) {
        displayMessage("Network Error.. Try again");
        console.log(e);
    }
}

form.addEventListener('reset', () => {
    error.innerText = '';
    document.getElementById('tourId').value = '';
});

function displayMessage(msg, success = false) {
    error.innerText = msg;
    error.style.color = success ? "green" : "red";
    error.style.marginLeft = "190px";
    error.style.marginTop = "20px";
}
