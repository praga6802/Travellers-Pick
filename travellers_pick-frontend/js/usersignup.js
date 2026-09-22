import { showMessage } from "./error.js";

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
            showMessage(responseData.message, true);
            setTimeout(() => {
                window.location.href = "../html/user-login.html";
            }, 2000);
        } else {
            showMessage(responseData.message, false);
            console.error("Backend Error:", responseData);
        }
    } catch (err) {
        showMessage("Network error..Please try again!");
        console.error(err);
    }
}

form.addEventListener("reset", () => {
    errorMsg.style.display = "none";
});
