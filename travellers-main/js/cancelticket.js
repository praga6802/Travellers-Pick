const error = document.getElementById('error');
const form = document.getElementById('cancelform');

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
        form.style.display='none';
        console.log(e);
    }
}


//cancel form

form.addEventListener('submit', handleCancel);


async function handleCancel(event) {
    event.preventDefault();
    const pnrInp=document.getElementById('pnr');
    const PNR_NUMBER = pnrInp.value.trim();
    if (!PNR_NUMBER) {
            displayMessage("Please provide PNR number for cancellation!");
            return;
    }

    try {
        const response = await fetch("http://localhost:8080/user/cancelTour", {
            method: "DELETE",
            credentials: 'include',
            body: JSON.stringify({ pnr:PNR_NUMBER }),
            headers: { "Content-Type": "application/json" }
        });
        
        const responseData = await response.json();
        
        if(response.status===401){
            displayMessage(responseData.message);
            return;
        }

        alert(responseData.message);
        error.innerText = '';
        pnrInp.value = '';



    } catch (e) {
        displayMessage("Network Error.. Try again");
        console.log(e);
    }
}

form.addEventListener('reset', () => {
    error.innerText = '';
    PNR_NUMBER.value = '';
});

function displayMessage(msg, success = false) {
    error.innerText = msg;
    error.style.color = success ? "green" : "red";
    error.style.marginLeft = "100px";
    error.style.marginTop = "20px";
}
