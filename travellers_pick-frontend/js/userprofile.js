import { showFormMessage, showSessionMessage } from "./error.js";
import { url } from "./config.js";
const login = document.getElementById("login-btn");
const signin = document.getElementById("signin-btn");

if (login) {
    login.value = "login";
    login.addEventListener("click", goLogin);
}

if (signin) {
    signin.addEventListener("click", () => {
        window.location.href = "../html/user-signup.html";
    });
}

async function displayUserName() {
    try {
        const response = await fetch(`${url}/user/current-user`, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json();
        if (response.status === 401) {
            showSessionMessage(data.message, false);
            setTimeout(() => {
                window.location.href = "../html/user-login.html";
            }, 2000);
            return;
        }

        if (!response.ok) {
            showSessionMessage(data.message, false);
            return;
        }

        const loginSelect = document.createElement("select");
        loginSelect.id = "loginSelect";
        loginSelect.className = "login-select";

        // Greeting
        const greetingOption = document.createElement("option");
        greetingOption.textContent = `Hello ${data.data.userName}!`;
        greetingOption.disabled = true;
        greetingOption.selected = true;

        // Logout
        const logoutOption = document.createElement("option");
        logoutOption.value = "logout";
        logoutOption.textContent = "Logout";

        // Add options
        loginSelect.appendChild(greetingOption);
        loginSelect.appendChild(logoutOption);

        if (login) {
            login.replaceWith(loginSelect);
        }

        if (signin) {
            signin.style.display = "none";
        }

        loginSelect.addEventListener("change", goLogin);
    } catch (err) {
        console.error(err);
        showSessionMessage("Network error..Please try again", false);
    }
}

async function goLogin(e) {
    const value = e.target.value;
    switch (value) {
        case "login":
            window.location.href = "../html/user-login.html";
            break;

        case "logout":
            try {
                const response = await fetch(`${url}/user/logout`, {
                    method: "POST",
                    credentials: "include",
                });

                if (response.ok) {
                    showSessionMessage("Logged out successfully!");
                    setTimeout(() => {
                        window.location.href = "../index.html";
                    }, 2000);
                } else {
                    showSessionMessage("Logout failed");
                }
            } catch (err) {
                console.error("Error logging out:", err);
                showSessionMessage(err);
            }
            break;

        default:
            console.log("No action");
    }
}

window.addEventListener("DOMContentLoaded", displayUserName);
