document.getElementById('deletepackageform').addEventListener('submit',handledelete)

async function handledelete(event){


    event.preventDefault();

    const form=new FormData(event.target);
    const msg=document.getElementById("error");
    msg.style.marginTop="20%";
    try{
        const response=await fetch("http://localhost:8080/admin/deletepackage",{
            method:"POST",
            body:form
        });

        const data= await response.json();
        if(response.ok){
            msg.style.color="green";
            msg.innerText=data.message;
             msg.style.textAlign="center";
            msg.style.margin="10%"
        }
        else{
            msg.style.color="red";
            msg.innerText="Invalid Credentials";
            msg.style.textAlign="center";
        }
    }

    catch(err){
        msg.style.color="red";
        msg.innerText="Network Error..Please try again";
        console.error(err);
    }
}