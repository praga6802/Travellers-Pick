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
        const response = await fetch(
            "https://travellers-pick-production.up.railway.app/user/signup",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            },
        );

        const responseData=await response.json();
        if(response.ok){
            alert(responseData.message);
            form.reset();
            error.innerText='';
        }
        else{
            console.error("Backend Error:",responseData);
            error.innerText=responseData.message;
        }

    }
    catch(err){
        console.error(err);
        error.innerText="Network Error..Please Try again";
    }
}


