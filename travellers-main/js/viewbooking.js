const error=document.getElementById('error');
window.addEventListener('DOMContentLoaded',handleViewBooking)
async function handleViewBooking(){
    const tbody=document.querySelector("#viewbooking tbody");

    const table= document.getElementById('viewbooking');
    table.style.display = 'none';
    const head= document.getElementById('table-head');
    head.style.display = 'none';

    try{
        const response=await fetch('http://localhost:8080/user/bookedTours',{
            method:"GET",
            credentials:"include"
        });
        const responseData=await response.json();

        if(!response.ok){
            showMessage(responseData.message,response.ok);
            return;
        }

        if(responseData.length===0 || !responseData){
            showMessage('No Tours Found!');
            return;
        }

        table.style.display='table';

        responseData.forEach(data=>{
            const row=document.createElement('tr');
            row.innerHTML=`
            <td>${data.tourId}</td>
            <td>${data.userName}</td>
            <td>${data.email}</td>
            <td>${data.contact}</td>
            <td>${data.packageName}</td>
            <td>${data.region}</td>
            <td>${data.noOfSeats}</td>
            <td>${data.noOfAdults}</td>
            <td>${data.noOfChildren}</td>
            <td>${data.bookedAt}</td>
            <td>${data.travelAt}</td>
            <td>${data.status}</td>
            `;
            tbody.appendChild(row);
        })

    }
    catch(e){
        showMessage("Network Error or Session Expired! Please log in again");
        return;
    }
}

function showMessage(msg){
    error.innerText=msg;
    error.style.color='red';
    error.style.marginTop='20px';
    error.style.marginLeft='50px';

    const table= document.getElementById('viewbooking');
    table.style.display='none';
}



