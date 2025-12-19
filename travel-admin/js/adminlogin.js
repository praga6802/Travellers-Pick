const form=document.getElementById("loginform");
form.addEventListener("submit",handleLogin)

async function handleLogin(event){
    event.preventDefault();

    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;

    const data={email,password}
    const error=document.getElementById("error");

    try{
        const response=await fetch("http://localhost:8080/admin/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data),
            credentials:"include"
        });
        const responseData=await response.json();
        if(response.ok){
            alert(responseData.message);
            window.location.href = "/travel-admin/html/left.html";
        }
        else{
            error.innerText=responseData.message;
        }
    }
    catch(err){
        error.innerText="Network Error..Please try again";
        console.error(err);
    }
}
form.addEventListener('reset',()=>{
    error.innerText='';
    document.getElementById('email').innerText='';
    document.getElementById('password').innerText='';
})
