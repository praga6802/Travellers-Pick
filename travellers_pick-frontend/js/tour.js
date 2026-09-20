const error=document.getElementById('error');
let tourdata=[];


document.addEventListener('DOMContentLoaded', async function loadTours() {
    try {
        const response = await fetch("http://localhost:8080/admin/allCategories", {
            method: "GET",
            credentials: "include"
        });

        tourdata = await response.json();
        if(!tourdata || tourdata.length===0){
            error.innerText = "No tours found!";
            error.style.color = 'red';
        }
        
        const url=new URLSearchParams(window.location.search);
        const packageId=parseInt(url.get('packageId'));
        showPackageTours(packageId);

        console.log("Tours loaded:", tourdata);
    }
    catch (e) {
        console.error("Failed to load tours:", e);
        error.innerText = "Network Error.. Unable to reach server!";
        error.style.color = 'red';
    }
});


function showPackageTours(packageId){
    if (!tourdata || tourdata.length === 0) {
        error.innerText="Tour data not loaded yet!";
        error.style.color='red';
        return;
    }

    const packageTours=tourdata.filter(tour=>tour.packageId==packageId);
    const container=document.getElementById('packageTourContainer');
    container.innerHTML='';

    if (packageTours.length === 0) {
        container.innerHTML = "<p>No tours found for this package</p>";
        return;
    }

    packageTours.forEach(t=>{
        container.innerHTML+=`
            <div class='card'>
                <img src="../${t.imgUrl}" alt="${t.tourName}">
                <h4>${t.tourName}</h4>
                <h6>${t.tourSlogan}</h6>
                <i style="font-size:24px" class="fa">&#xf041;</i>
                <p>${t.places}</p>
                <span class="package-name"> <i style="font-size:24px" class="fa">&#xf017;</i> Days: ${t.days} - Nights: ${t.nights}</span>
                <p id='price'>Price: Rs.${t.price}</p>
			    <button class="btn" onclick="tourChange('${t.fileName}')">BOOK NOW</button>
		</div>
        `;
    });
}

function tourChange(value){
    window.location.href=`../html/${value}`;
}
