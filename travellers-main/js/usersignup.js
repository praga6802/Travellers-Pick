const form=document.getElementById("usersignup")
form.addEventListener("submit",handleSignUp)
const error=document.getElementById('error');

async function handleSignUp(event){

    event.preventDefault();
    const username=document.getElementById('username').value;
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const contact=document.getElementById('contact').value;
    
    const data={username,email,password,contact};
    try{
        const response= await fetch("http://localhost:8080/user/signup",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
        });

        const responseData=await response.json();
        if(response.ok){
            alert(responseData.message);
        }
        else{
            error.innerText=responseData.message;
            error.style.color="red";
            error.style.marginTop="10px";
            error.style.marginLeft="100px";
        }

        if(response.ok)data.innerText='';
    }
    catch(err){
        error.innerText="Network Error..Please Try again";
        console.error(err);
    }
}


