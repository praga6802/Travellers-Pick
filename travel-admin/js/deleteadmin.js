const form=document.getElementById("delAdmin");
form.addEventListener('submit',handleDeleteAdmin);


async function handleDeleteAdmin(event){
    event.preventDefault();

     const formdata=new FormData(event.target);

    let error=document.getElementById('deleteadmin');


    try{

        const response=await fetch("http://localhost:8080/admin/deleteadmin",{
            body:formdata,
            method:"POST",
            credentials:"include"
        });

        if(response.ok){
            error.innerText='Admin Deleted Successfully';
            error.style.color='white';
            error.style.backgroundColor='black';
            setTimeout(()=>{form.reset();
                error.style.color='';
                error.style.backgroundColor='';
            },2000)
        }
        else{
            error.innerText='Admin not found!';
            error.style.color='red';
        }

           error.style.textAlign='center';
            error.style.marginTop="50px";

    }

    catch(err){
        error.innerText="Network Error..Please Try again";
        error.style.color='red';

    }


  









}
