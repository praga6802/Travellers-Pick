window.addEventListener("DOMContentLoaded",displayUserName)
async function displayUserName(){
    try{
        const response= await fetch("http://localhost:8080/user/current-user",{
            method:"GET",
            credentials:"include"
        });

        if(response.ok){
            const data=await response.json();
            const username=document.querySelector("#loginlist option[value='Login']")
            username.textContent=`Hello ${data.userName}`;
            

            let userOption= document.getElementById('user');
            userOption.textContent="Logout";
            userOption.value='logout';
            
            document.getElementById('admin').style.display="none";
        
        }
        else{
            console.log("User not found ");
        }
    }
    catch(err){
        console.log("Error fetching User Info");
    }
}

const form = document.getElementById("tourForm");
const error = document.getElementById('error');

form.addEventListener("submit", handleForm);

async function handleForm(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const packageName = document.getElementById('packageName').value.trim();
    const region = document.getElementById('region').value.trim();
    const bdate = document.getElementById('bdate').value.trim();
    const tdate = document.getElementById('tdate').value.trim();
    const noOfSeats = parseInt(document.getElementById('noOfSeats').value.trim()) || 0;
    const noOfAdults = parseInt(document.getElementById('noOfAdults').value.trim()) || 0;
    const noOfChildren = parseInt(document.getElementById('noOfChildren').value.trim()) || 0;
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const country = document.getElementById('country').value.trim();

    const data = {
        name, email, phone, packageName, region, bdate, tdate,
        noOfSeats, noOfAdults, noOfChildren, city, state, country
    };

    try {
        const response = await fetch(`http://localhost:8080/user/${packageName}/book`, {
            method: "POST",
            body: JSON.stringify(data),
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });

        if (response.ok) {
            const responseData = await response.json();
            alert(responseData.message);
            error.innerText = "";
            form.reset();
        } else {
            const text = await response.text();
            error.innerText = "You are not authorized or session expired";
            error.style.color = "red";
        }

    } catch (err) {
        console.error("Network Error:", err);
        alert("Network Error. Please try again.");
    }
}
