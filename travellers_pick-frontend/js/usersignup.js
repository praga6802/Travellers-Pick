import { showFormMessage, showSessionMessage } from "./error.js";
import { url } from "./config.js";
const form = document.getElementById("signup-form");
form.addEventListener("submit", handleSignUp);

async function handleSignUp(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const contact = document.getElementById("contact").value;

    const data = { username, email, password, contact };
    try {
        const response = await fetch(`${url}/user/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        if (response.ok) {
            showFormMessage(responseData.message, true);

            document.getElementById("username").value = "";
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
            document.getElementById("contact").value = "";
            setTimeout(() => {
                window.location.href = "../html/user-login.html";
            }, 2000);
            return;
        } else {
            showFormMessage(responseData.message, false);
            console.error("Backend Error:", responseData);
            return;
        }
    } catch (err) {
        showSessionMessage("Network error..Please try again!", false);
        console.error(err);
    }
}
