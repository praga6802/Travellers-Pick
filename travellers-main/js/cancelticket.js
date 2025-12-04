//cancel ticket

const error=document.getElementById('error');
const form=document.getElementById('cancelform');
form.addEventListener('submit',handleCancel);

async function handleCancel(event){
    event.preventDefault();
    const tourId=parseInt(document.getElementById('tourId').value.trim());

    if(!tourId){
        error.innerText="Please provide Tour ID to cancel booking!!";
        error.style.color="red";
        error.style.margin="20px";
        error.style.marginLeft="270px"
        return;
    }
try{
    const response=await fetch("http://localhost:8080/user/cancelTour",{
        method:"DELETE",
        credentials:'include',
        body:JSON.stringify({tourId}),
        headers:{
            "Content-Type":"application/json"
        }
    });

    const responseData=await response.json();
    error.innerText=responseData.message;
    error.style.color=response.ok?"green":'red';
    error.style.marginTop="20px";
    error.style.marginLeft="270px"
}
catch(e){
    error.innerText="Something went wrong..Please try again";
    error.style.color="red";
    console.log(e);
    window.location.href='./login.html';
}
}

form.addEventListener('reset',()=>{
    error.innerText='';
    form.querySelectorAll('input').forEach(inp=>inp.value="");
})


