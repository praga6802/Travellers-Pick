//get the logged user
const error = document.getElementById('error');
window.addEventListener("DOMContentLoaded",displayUserName)
async function displayUserName(){
    try{
        const response= await fetch("http://localhost:8080/user/current-user",{
            method:"GET",
            credentials:"include"
        });

        if(!response){
            error.innerText="User not found"
            return;
        }
        const text=await response.text();
        if(!text)return;

        const data=JSON.parse(text);
        if(!data.userId){
            error.innerText='No logged-in user';
            return;
        }
        document.getElementById('userId').value=data.userId;
    }
    catch(err){
        console.log("Error fetching User Info",err);
    }
}


//sending the form with logged user id
const form = document.getElementById("tourForm");

form.addEventListener("submit", handleForm);
async function handleForm(event) {
    event.preventDefault();
    const userId=parseInt(document.getElementById('userId').value.trim());
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const packageName = document.getElementById('packageName').value.trim();
    const region = document.getElementById('region').value.trim();
    console.log(region);
    const bdate = document.getElementById('bdate').value.trim();
    const tdate = document.getElementById('tdate').value.trim();
    const noOfAdults = parseInt(document.getElementById('noOfAdults').value.trim()) || 0;
    const noOfChildren = parseInt(document.getElementById('noOfChildren').value.trim()) || 0;
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const country = document.getElementById('country').value.trim();

    const noOfSeats=noOfAdults+noOfChildren;


    const data = {
        userId,name, email, phone, packageName, region, bdate, tdate,
        noOfSeats, noOfAdults, noOfChildren, city, state, country
    };

    try {
        const response = await fetch(`http://localhost:8080/user/${packageName}/book`, {
            method: "POST",
            body: JSON.stringify(data),
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });
        const responseData = await response.json();
        if (response.ok) {
            alert(responseData.message);
            error.innerText = "";
            form.reset();
        } else {
            error.innerText = responseData.message;
            error.style.color = "red";
        }

    } catch (err) {
        console.error("Network Error:", err);
        alert("Session Expired..Please try again..");
        setTimeout(()=>window.location.href='./login.html',1000);
    }
}

form.addEventListener('reset',()=>{
    error.innerText='';
    data.innerText='';
})
