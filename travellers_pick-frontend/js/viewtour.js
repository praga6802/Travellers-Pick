document.addEventListener('DOMContentLoaded',async ()=>{

const tbody=document.querySelector("#viewcategory tbody");

try{
    const response=await fetch("http://localhost:8080/admin/allCategories",
        {
            method:"GET",
            credentials:"include"
        }
    );

    if(!response)throw new Error("Failed to fetch tours");

    const tours=await response.json();

    if(tours===0){
        tbody.innerHTML='<tr><td colspan="8">No Tours Found</td></tr>';
        return;
    }

    tours.forEach(tour=>{
        const row=document.createElement('tr');
        row.innerHTML=`
        <td>${tour.tourId}</td>
        <td>${tour.packageId}</td>
        <td>${tour.tourName}</td>
        <td>${tour.tourSlogan}</td>
        <td>${tour.places}</td>
        <td>${tour.price}</td>
        <td>${tour.days}</td>
        <td>${tour.nights}</td>
        `;
        tbody.appendChild(row);
        
    });
  
}
catch(err){
    console.error(err);
    tbody.innerHTML="<tr><td>Failed to Load Tours</td></tr>";
}
});



























