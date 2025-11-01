document.getElementById("loginform").addEventListener("submit",handleLogin)


async function handleLogin(event){
    event.preventDefault();

    const loginformData= new FormData(event.target);

    try{

        const response=await fetch("http://localhost:8080/admin/adminlogin",{

            method:"POST",
            body:loginformData,
            credentials:"include"
        });

        let data=await response.json();
        if(response.ok){
            alert('Login Successful');
            console.log(data);
            localStorage.setItem("adminId",data.adminId)
            localStorage.setItem('adminUserName',data.adminUserName);
            event.target.reset();
            window.location.href="left.html";
        }
        else{
            let error=document.getElementById("error");
            error.innerText=data.error;
            event.target.reset();
        }
    }
    catch(err){
        document.getElementById("error").innerText="Network Error..Please try again";
        console.error(err);
    }


}