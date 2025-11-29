document.getElementById("loginform").addEventListener('submit', handleLogin);

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const data = { email, password };
    const error = document.getElementById('error');
    error.innerText = "";

    try {
        const response = await fetch("http://localhost:8080/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include"
        });

        if (response.ok) {
            const text = await response.json();
            alert(text.message);
            setTimeout(() => window.location.href = 'index.html', 1000);
        } 
        else if(response.status===401){
            const errorMsg=await response.json();
            error.innerText=errorMsg.message;
            event.target.reset();
        }
        else {
            const errorMsg = await response.json();
            error.innerText = errorMsg.message;
            event.target.reset();
        }
    } catch (err) {
        error.innerText = "Network error..Please try again..";
        console.error(err);
    }
}
