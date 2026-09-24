import { showFormMessage, showSessionMessage } from "./error.js";
import { url } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signup-form");
    if (form) {
        form.addEventListener("submit", handleSignUp);
        form.addEventListener("reset", () => {
            showFormMessage("", true);
            showSessionMessage("", true);
        });
    }
});

async function handleSignUp(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const contact = document.getElementById("contact").value.trim();

    if (!username || !email || !password || !contact) {
        showFormMessage("All fields are required!", false);
        return;
    }

    const data = {
        username,
        email,
        password,
        contact,
    };

    try {
        const response = await fetch(`${url}/admin/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include",
        });

        const responseData = await response.json();

        if (response.ok) {
            showFormMessage(responseData.message, true);
            document.getElementById("username").value = "";
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
            document.getElementById("contact").value = "";
            setTimeout(() => {
                window.location.href = "../html/admin-login.html";
            }, 2000);
            return;
        } else {
            showFormMessage(responseData.message || "Registration failed",false);
            return;
        }
    } catch (err) {
        showSessionMessage("Network error..Please try again!", false);
        console.error(err);
    }
}
