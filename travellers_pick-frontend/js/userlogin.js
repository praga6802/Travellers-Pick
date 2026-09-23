import { showFormMessage, showSessionMessage } from "./error.js";
import { url } from "./config.js";
const form = document.getElementById("login-form");
form.addEventListener("submit", handleLogin);

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const data = { email, password };

    try {
        const response = await fetch(`${url}/user/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include",
        });
        const responseData = await response.json();
        console.log(responseData);
        if (response.ok) {
            showFormMessage(responseData.message, true);
            setTimeout(() => (window.location.href = `../index.html`), 2000);
        } else {
            showFormMessage(responseData.message, false);
            console.log("Back end error:", responseData);
        }
    } catch (err) {
        showFormMessage("Network error..Please try again!");
        console.error(err);
    }
}
