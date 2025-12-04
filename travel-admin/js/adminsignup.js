document.getElementById("signupform").addEventListener("submit",handleSignUp)

async function handleSignUp(event){
    event.preventDefault();

    const userName=document.getElementById("username").value;
    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;
    const contact=document.getElementById("contact").value;

    const error=document.getElementById("error");
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
            const text=await response.json();
            console.log(text);
            alert(text.message);
            window.location.href="loginform.html"
        }
        else{
            const errorMsg= await response.json();
            console.log(errorMsg);
            error.innerText=errorMsg.message;
            event.target.reset();
        }
    }
    catch(err){
        error.innerText="Network error.Please try again";
        console.error(err);
    }
}

form.addEventListener('reset',()=>{
    error.innerText='';
    form.querySelectorAll('input').forEach(inp=>inp.value="");
})
