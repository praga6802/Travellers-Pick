const form = document.getElementById("login-form");
form.addEventListener("submit", handleLogin);
const error = document.getElementById("error");

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const data = { email, password };
    try {
        const response = await fetch("http://localhost:8080/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include",
        });
        const text = await response.json();
        if (response.ok) {
            error.textContent = text.message;
            error.classList.remove("failure");
            error.classList.add("success");
            setTimeout(() => (window.location.href = `../index.html`), 2000);
        } else {
            error.textContent = text.message;
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