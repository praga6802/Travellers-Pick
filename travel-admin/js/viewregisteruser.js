document.addEventListener("DOMContentLoaded",async ()=>{

const tbody=document.querySelector("#regtable tbody");

try{

    const response=await fetch("http://localhost:8080/admin/allregusers",
        {
            method:"GET",
            headers:{
            "Content-Type":'application/json'},
            credentials:"include"
        }
    );

    if(!response) throw new Error("Network Issue..Please try again");


    const details=await response.json();

    if(details.length===0){
        tbody.innerHTML="<tr><td>Customer details not found</td></tr>";
    }
    details.forEach(detail => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${detail.tourId}</td>
            <td>${detail.user.id}</td>
            <td>${detail.name}</td>
            <td>${detail.email}</td>
            <td>${detail.phone}</td>
            <td>${detail.packageName}</td>
            <td>${detail.region}</td>
            <td>${new Date(detail.bdate).toLocaleDateString()}</td>
            <td>${new Date(detail.tdate).toLocaleDateString()}</td>
            <td>${detail.noOfSeats}</td>
            <td>${detail.noOfAdults}</td>
            <td>${detail.noOfChildren}</td>
            <td>${detail.city}</td>
            <td>${detail.state}</td>
            <td>${detail.country}</td>
            <td>${detail.status}</td>
        `;
        if (detail.status === 'CANCELLED') {
            row.querySelectorAll('td').forEach(td=>{td.setAttribute("style","color:red;font-weight:bold");
            });
        }
        tbody.appendChild(row);
    });

}
catch(err){
    console.error(err);
    tbody.innerHTML="<tr><td>Error! No Details Found</td></tr>";
}
});