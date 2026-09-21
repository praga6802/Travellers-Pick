const form = document.getElementById("login-form");
form.addEventListener("submit", handleLogin);
const error = document.getElementById("error");
const url = "https://travellers-pick-production.up.railway.app/";

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const data = { email, password };
    try {
        const response = await fetch(`${url}user/user-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include",
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            error.textContent = data.message;
            error.classList.remove("failure");
            error.classList.add("success");
            setTimeout(() => (window.location.href = `../index.html`), 2000);
        } else {
            error.textContent = data.message;
            error.classList.remove("success");
            error.classList.add("failure");
            console.log("Back end error:", text);
        }
    } catch (err) {
        error.textContent = "Network error..Please try again..";
        error.classList.remove("success");
        error.classList.add("failure");
        console.error(err);
    }
}
