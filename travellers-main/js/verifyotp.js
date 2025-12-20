const error = document.getElementById('error');
const form = document.getElementById('otp-form');
const otpinp=document.querySelectorAll('.otp');

//get the user data
window.addEventListener("DOMContentLoaded",displayUserDetails);
async function displayUserDetails(){
    try{
        const response=await fetch("http://localhost:8080/user/userData",{
            method:"GET",
            credentials:"include"
        });
        const responseData=await response.json();

        if(!response.ok){
            console.log("logged User");
            return;
        }
    }
    catch(e){
        displayMessage('Network Error or Session Expired. Please login again!');
        form.style.display='none';
        setTimeout(()=>{window.location.href='../html/login.html'},1500);
    }
}

// otp box navigation
otpinp.forEach((inp,index)=>{

    //moving forward
    inp.addEventListener('input',()=>{
        if(inp.value && index<otpinp.length-1){
            otpinp[index+1].focus();
        }
    });

    //moving backward
    inp.addEventListener('keydown',e=>{
        if(e.key==='Backspace' && !inp.value && index>0){
            otpinp[index-1].focus();
        }
    });

});


form.addEventListener("submit",verifyOTP)

async function verifyOTP(e){
    e.preventDefault();
    let otp='';
    
    otpinp.forEach(inp=>otp+=inp.value)
    
    if(otp.length!==6){
        displayMessage('Please Enter 6-digit OTP');
        return;
    }

    const data={otp};

    try{
    const response=await fetch("http://localhost:8080/user/verifyOTP",{
        method:"POST",
        credentials:"include",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)

    });
    const resData=await response.json();
    displayMessage(resData.message, response.ok);

    if(response.ok){
        setTimeout(()=>{
            window.location.href='../html/login.html'
        },1000);
    }

    }
    catch(e){
        displayMessage("Network error..Please try again");
        console.log(e);
        return;
    }
}
//display message
function displayMessage(msg,response=false){
    error.innerText=msg;
    error.style.color = response ? "green" : "red";
    error.style.marginTop = "20px";
    error.style.marginLeft="170px";
}

//reset button
form.addEventListener('reset',()=>{
    otpinp.forEach(inp=>inp.value='');
    error.innerText='';
})