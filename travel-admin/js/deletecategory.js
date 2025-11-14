document.getElementById("deletecategoryform").addEventListener("submit", handledeletecategory);

async function handledeletecategory(event) {
    event.preventDefault();


    const formdata= new FormData(event.target);
    const errorMsg=document.getElementById("error");

    try{
        const response=await fetch("http://localhost:8080/admin/deletetour",{
            method:"POST",
            body:formdata
        });

        const data=await response.json();


        if(response.ok){
            errorMsg.style.color="yellowgreen";
            errorMsg.innerText=data.message;
        }
        else{
            errorMsg.style.color="orange";
            errorMsg.innerText=data.error;
        }

    }
    catch(err){
        errorMsg.innerText="Network Error.. Please try again";
        console.error(err);
    }
}