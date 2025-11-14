document.getElementById("usersignup").addEventListener("submit",handleSignUp)


async function handleSignUp(event){

    event.preventDefault();


    const userName=document.getElementById('username').value;
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const contact=document.getElementById('phonenumber').value;
    
    const data={
        username:userName,
        email:email,
        password:password,
        contact:contact
    }

    try{

        const response= await fetch("http://localhost:8080/user/usersignup",{

        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
        });

        if(response.ok){
            const text=await response.text();
            alert(text);
            window.location.href="../html/login.html";
        }

        else{
            const errorMsg=await response.json();
            document.getElementById("error").innerText=errorMsg.error;
            event.target.reset();
        }
    }
    catch(err){
        document.getElementById("error").innerText="Network Error..Please Try again";
        console.error(err);
    }

}

