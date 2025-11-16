document.getElementById("loginform").addEventListener("submit",handleLogin)


async function handleLogin(event){
    event.preventDefault();

    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;

    const data={email,password}

    try{

        const response=await fetch("http://localhost:8080/admin/login",{

            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data),
            credentials:"include"
        });

        if(response.ok){
            const msg=await response.json();
            alert(msg.message);
            window.location.href="left.html";
        }
        else{
            let err=await response.json();
            document.getElementById("error").innerText=err.error;
            event.target.reset();
        }
    }
    catch(err){
        document.getElementById("error").innerText="Network Error..Please try again";
        console.error(err);
    }


}