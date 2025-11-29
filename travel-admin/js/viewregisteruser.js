document.addEventListener("DOMContentLoaded",async ()=>{

const tbody=document.querySelector("#regtable tbody");

try{

    const response=await fetch("http://localhost:8080/admin/allregusers",
        {
            method:"GET",
            "Content-Type":'application/json',
            credentials:"include"
        }
    );

    if(!response) throw new Error("Network Issue..Please try again");


    const details=await response.json();

    if(details.length===0){
        tbody.innerHTML="<tr><td>Customer details not found</td></tr>";
    }


    details.forEach(detail=>{
        const row=document.createElement('tr');
        row.innerHTML=`
        <td>${detail.id}</td>
        <td>${detail.name}</td>
        <td>${detail.email}</td>
        <td>${detail.phone}</td>
        <td>${detail.package_name}</td>
        <td>${detail.region}</td>
        <td>${detail.num_seats}</td>
        <td>${detail.city}</td>
        <td>${detail.state}</td>
        <td>${detail.country}</td>
        <td>${detail.bdate}</td>
        <td>${detail.tdate}</td>
        `;
        tbody.appendChild(row);
    });
}
catch(err){
    console.error(err);
    tbody.innerHTML="<tr><td>Error! No Details Found</td></tr>";
}
});