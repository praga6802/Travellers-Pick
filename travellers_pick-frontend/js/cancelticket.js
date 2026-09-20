const error = document.getElementById('error');
const form = document.getElementById('cancelform');

//get user data
async function displayUserDetails(){
    try{
        const response=await fetch("http://localhost:8080/user/userData",{
            method:"GET",
            credentials:"include"
        });
        const responseData=await response.json();
        
        if(!response.ok){
            console.log("Error",responseData);
            error.innerText=responseData.message;
            return;
        }
        console.log("User",responseData);
    }
    catch(e){
        console.error("Network Error",e);
        alert("Network Error.. Redirect to login");
        if (form)form.style.display='none';
        setTimeout(()=>{window.location.href='../html/login.html'},2000);
    }
}


//cancel form
form.addEventListener('submit', handleCancel);


async function handleCancel(event) {
    event.preventDefault();
    const pnrInp=document.getElementById('pnr');
    const PNR_NUMBER = pnrInp.value.trim();
    if (!PNR_NUMBER) {
        error.innerText=responseData.message;
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
            error.innerText=responseData.message;
            return;
        }
        
        alert(responseData.message);
        error.innerText = '';
        pnrInp.value = '';
        
    } catch (e) {
        error.innerText="Network Error.. Try again";
        console.log(e);
    }
}

form.addEventListener('reset', () => {
    error.innerText = '';
    PNR_NUMBER.value = '';
});


window.addEventListener("DOMContentLoaded",displayUserDetails);
