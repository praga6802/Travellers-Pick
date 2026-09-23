import { showMessage } from "./error.js";
import { url } from "./config.js";
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    if (form) {
        form.addEventListener("submit", handleLogin);
        form.addEventListener("reset", () => {
            showMessage("", true);
        });
    }
});

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        showMessage("Email and password are required!", false);
        return;
    }

    const data = { email, password };

    try {
        const response = await fetch(`${url}/admin/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include",
        });

        const responseData = await response.json();

        if (response.ok) {
            showMessage(responseData.message, true);
            setTimeout(() => {
                window.location.href = "../html/admin-home.html";
            }, 2000);
            return;
        } else {
            showMessage(responseData.message, false);
            console.error(responseData);
        }
    } catch (err) {
        showMessage("Network error..Please try again", false);
        console.error(err);
    }
}
