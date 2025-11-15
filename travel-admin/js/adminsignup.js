document.getElementById("signupform").addEventListener("submit",handleSignUp)

async function handleSignUp(event){
    event.preventDefault();

    const userName=document.getElementById("username");
    const email=document.getElementById("email");
    const password=document.getElementById("password");
    const contact=document.getElementById("contact");
    

    const data={
        username:userName,
        email:email,
        password:password,
        contact:contact
    }

    try{
        const response=await fetch("http://localhost:8080/admin/signup",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        });
        if(response.ok){
            const text=await response.text();
            alert(text);
            window.location.href="loginform.html"
            
        }
        else{
            const errorMsg= await response.json();
            document.getElementById("error").innerText=errorMsg.error;
            event.target.reset();
        }
    }
    catch(err){
        document.getElementById("error").innerText="Network error.Please try again";
        console.error(err);
    }
}