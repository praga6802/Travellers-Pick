const form=document.getElementById("userloginform")
form.addEventListener('submit', handleLogin);
const error=document.getElementById('error');

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const data = { email, password };
    try {
        const response = await fetch("http://localhost:8080/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include"
        });
        const text = await response.json();
        if (response.ok) {
            error.innerText="";
            alert(text.message);
            setTimeout(() => window.location.href = '/travellers-main/html/index.html', 1000);
        } 
        else {
            error.innerText =text.message;
            error.style.color='red';
            form.reset();
        }
    } catch (err) {
        error.innerText = "Network error..Please try again..";
        error.style.color='red';
        console.error(err);
    }
}

form.addEventListener('reset',()=>{
    error.innerText='';
    form.querySelectorAll('input').forEach(inp=>inp.value="");
})
