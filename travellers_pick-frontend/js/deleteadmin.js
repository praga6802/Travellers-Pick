const form=document.getElementById("delAdmin");
form.addEventListener('submit',handleDeleteAdmin);

async function handleDeleteAdmin(event){
    event.preventDefault();
    let adminId=document.getElementById("adminId").value.trim();
    let password=document.getElementById("password").value.trim();
    let error=document.getElementById('deleteadmin');
    const data={
        adminId,password
    }
    if (!adminId || !password) {
        error.innerText = "Admin ID and Password are required";
        error.style.color = "red";
        return;
    }


    try{
        const response=await fetch("http://localhost:8080/admin/deleteAdmin",{
            body:JSON.stringify(data),
            method:"DELETE",
            headers:{
                "Content-Type":"application/json"
            },
            credentials:"include"
        });
        
        const responseData=await response.json();
        setTimeout(()=>{
            error.innerText=responseData.message;
            error.style.color=response.ok?"green":"red";
            error.style.textAlign='center';
            error.style.marginTop="50px";
            form.reset();
        },2000)
    }

    catch(err){
        event.preventDefault();
        error.innerText='Error: Session Expired & Cannot fetch user details'
        error.style.color='red';
        error.style.marginLeft="200px";
        error.style.marginTop="20px";
        console.log(err);
    }
}

form.addEventListener('reset',()=>{
    error.innerText='';
    form.querySelectorAll('input').forEach(inp=>inp.value="");
})
