document.getElementById('updatepackageform').addEventListener('submit',handleupdate)

async function handleupdate(event){


    event.preventDefault();

    const form=new FormData(event.target);
    const msg=document.getElementById("error");

    try{
        const response=await fetch("http://localhost:8080/admin/updatepackage",{
            method:"POST",
            body:form
        });

        const data= await response.json();
        if(response.ok){
            msg.style.color="yellowgreen";
            msg.innerText=data.message;
        }
        else{
            msg.style.color="orange";
            msg.innerText=data.error;
        }
    }

    catch(err){
        msg.style.color="red";
        msg.innerText="Network Error..Please try again";
        console.error(err);
    }
}