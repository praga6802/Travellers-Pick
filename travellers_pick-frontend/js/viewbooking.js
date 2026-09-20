const error = document.getElementById('error');

window.addEventListener("DOMContentLoaded", () => {
    displayUserDetails();
    handleViewBooking();
});

//get the user details
async function displayUserDetails() {
    try {
        const response = await fetch("http://localhost:8080/user/userData", {
            method: "GET",
            credentials: "include"
        });
        const data = await response.json();
        if (!response.ok) {
            showMessage(data.message);
            return;
        }
        console.log("Logged-in User:", data);

    } catch (e) {
        showMessage('Network Error or Session Expired. Please login again!');
        form.style.display='none';
        setTimeout(()=>{
            window.location.href='../html/login.html';}
        ,2000);
    }
}

//handle view booking
async function handleViewBooking() {

    try {
        const response = await fetch("http://localhost:8080/user/bookedTours", {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            const data = await response.json();
            showMessage(data.message);
            return;
        }

        const responseData = await response.json();
        
        // card container
        const cardContainer=document.getElementById('bookingCards');
        cardContainer.innerHTML='';
        responseData.forEach(item=>{
            const card=document.createElement('div');
            card.classList.add('booking-card');

            //status color
            let statusClass='';
            if(item.status==='CONFIRMED')statusClass='status-confirmed';
            else if(item.status==='CANCELLED')statusClass='status-cancelled';
            else if(item.status==='PENDING')statusClass='status-pending';
            

            card.innerHTML=`
                <div class='booking-header'>
                    ${item.packageName} - ${item.region}
                </div>
                 <div class="booking-body">
                    <p><strong>Booking ID:</strong> ${item.bookingId}</p>
                    <p><strong>Name:</strong> ${item.userName}</p>
                    <p><strong>Email:</strong> ${item.email}</p>
                    <p><strong>Contact:</strong> ${item.contact}</p>
                    <p><strong>No of Seats:</strong> ${item.noOfSeats}</p>
                    <p><strong>No of Adults:</strong> ${item.noOfAdults}</p>
                    <p><strong>No of Children:</strong> ${item.noOfChildren}</p>
                    <p><strong>Price:</strong> ${item.price}</p>
                </div>
                <div class='date-info'>
                    <span class='date'><strong>Booked Date:</strong> ${item.bookedAt}</span>
                    <span class='date'><strong>Travel Date:</strong> ${item.travelAt}</span>
                </div>

                
                <div class="booking-status ${statusClass}">
                    <span >${item.status}</span>
                </div>
                
            `
            cardContainer.appendChild(card);
        })

    } catch (e) {
        showMessage("Network Error or Session Expired! Please log in again");
        console.log(e);
    }
}


function showMessage(msg) {
    error.innerText = msg;
    error.style.color = 'red';
    error.style.marginTop = '30px';
    error.style.marginLeft = '250px';
    error.style.textAlign='center';
}
