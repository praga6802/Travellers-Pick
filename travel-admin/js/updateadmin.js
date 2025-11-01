const form=document.getElementById("updateAdmin");
form.addEventListener('submit',handleUpdateAdmin);


async function handleUpdateAdmin(event){
    event.preventDefault();

     const formdata=new FormData(event.target);

    let error=document.getElementById('update-status');


    try{

        const response=await fetch("http://localhost:8080/admin/updateadmin",{
            body:formdata,
            method:"POST",
            credentials:"include"
        });

        if(response.ok){
            error.innerText='Admin Details Updated Successfully';
            error.style.color='white';
            error.style.backgroundColor='black';
            setTimeout(()=>form.reset(),3000);
        }
        else{
            error.innerText='Invalid Credentials';
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
