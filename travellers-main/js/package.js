
document.addEventListener('DOMContentLoaded',displayPackage)
async function displayPackage(){
try{
    const response=await fetch('http://localhost:8080/admin/allPackages',{
        method:'GET',
        credentials:"include"
    });
    if(!response.ok)throw new Error("Unable to fetch Packages");

    const responseData=await response.json();
    const tourContainer=document.getElementById('packageContainer');

    if(!tourContainer){
        console.log("Package Container not found!");
        return;
    }

    tourContainer.innerHTML='';

    responseData.forEach((pkg)=>{
        const card=document.createElement('div');
   
        card.className='card';
        card.innerHTML=`
        <img src='../${pkg.imgUrl}' alt='${pkg.packageName}'>
        <h2>${pkg.packageName}</h2>
        <h6> -${pkg.packageSlogan}- </h6>
        <button class='btn' onclick="tourChange('${pkg.fileName}')">EXPLORE</button>
        `
        tourContainer.appendChild(card);

    });
}
catch(e){
    console.error("Failed to fetch or display packages:", e);
}
}

function tourChange(value){
    window.location.href='../html/'+value;
}