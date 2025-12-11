
document.addEventListener('DOMContentLoaded',displayPackage)
const error=document.getElementById('error');
async function displayPackage(){
try{
    const response=await fetch('http://localhost:8080/admin/allPackages',{
        method:'GET',
        credentials:"include"
    });
    if(!response.ok)throw new Error("Unable to fetch Packages");

  
    const tourContainer=document.getElementById('packageContainer');

    if(!tourContainer){
        error.innerText="Unable to get package container!"
        error.style.color='red';
        return;
    }
    const responseData=await response.json();
    if(!responseData){
        error.innerText="No Packages Found!"
        error.style.color='red';
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
        <button class='btn' onclick="tourChange('${pkg.fileName}','${pkg.packageId}')">EXPLORE</button>
        `
        tourContainer.appendChild(card);

    });
}
catch(e){
    console.error("Failed to fetch or display packages:", e);
}
}

function tourChange(fileName, packageId) {
    window.location.href = `../html/${fileName}?packageId=${packageId}`;
}
