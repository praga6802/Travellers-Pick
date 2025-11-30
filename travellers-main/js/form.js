const form=document.getElementById("tourForm");
form.addEventListener("submit", handleForm);
const error=document.getElementById('error');

async function handleForm(event){
    event.preventDefault();
    const name=document.getElementById('name').value.trim();
    const email=document.getElementById('email').value.trim();
    const phone=document.getElementById('phone').value.trim();
    const packageName=document.getElementById('packageName').value.trim();
    const region=document.getElementById('region').value.trim();
    const bdate=document.getElementById('bdate').value.trim();
    const tdate=document.getElementById('tdate').value.trim();
    const noOfSeats=document.getElementById('noOfSeats').value.trim();
    const noOfAdults=document.getElementById('noOfAdults').value.trim();
    const noOfChildren=document.getElementById('noOfChildren').value.trim();
    const city=document.getElementById('city').value.trim();
    const state=document.getElementById('state').value.trim();
    const country=document.getElementById('country').value.trim();

    const data={
        name,email,phone,packageName,region,bdate,tdate,noOfSeats,noOfAdults,noOfChildren,city,state,country
    }
    
    try {

        const response = await fetch(`http://localhost:8080/user/${packageName}/book`, {
            method: "POST",
            body: JSON.stringify(data),
            credentials:"include",
            headers:{"Content-Type":"application/json"}
        });

        const responseData=await response.json();
        
        if(response.ok){
            alert(responseData.message);
            error.innerText="";
            event.target.reset();
        } else {
            error.innerText=responseData.message;
            error.style.color="red"   
        }
        error.style.borderTop="12px";
        

    } catch(err) {
        alert("Network Error. Please try again");
        console.error(err);
    }
}