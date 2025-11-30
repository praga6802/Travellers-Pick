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

        if(response.ok){
            const responseData=await response.json();
            alert(responseData.message);
            window.location.href="../html/login.html";
        }
        else{
            const errorMsg=await response.json();
            error.innerText=errorMsg.message;
            event.target.reset();
        }
    }
    catch(err){
        error.innerText="Network Error..Please Try again";
        console.error(err);
    }

}

