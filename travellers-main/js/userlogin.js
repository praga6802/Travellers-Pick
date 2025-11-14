document.getElementById("userloginform").addEventListener('submit',handleLogin)


async function handleLogin(event){


    event.preventDefault();

    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;

    const data={
        email,password
    }

    const error=document.getElementById('error');


    try{
        const response=await fetch("http://localhost:8080/user/userlogin",{

            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data),
            credentials:"include"
        });

        if(response.ok){
            const text=await response.json();
            alert(text.message);
            setTimeout(()=>window.location.href='index.html',1000);
        }

        else{
            const errorMsg=await response.json();
            document.getElementById('error').innerText=errorMsg.error;
            event.target.reset();
        }
    }
    catch(err){
        document.getElementById('error').innerText="Network error..Please try again..";
        console.error(err);
    }
}