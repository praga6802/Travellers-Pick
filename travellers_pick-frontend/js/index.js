import { showMessage } from "./error.js";

const signin = document.getElementById("signin-btn");
const login = document.getElementById("login-btn");

if (signin) {
    signin.addEventListener("click", () => {
        window.location.href = "/html/user-signup.html";
    });
}

if (login) {
    login.addEventListener("click", () => {
        window.location.href = "/html/user-login.html";
    });
}

async function displayUserName() {
    try {
        const response = await fetch(`${url}/user/current-user`, {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            console.log("User not logged in or session expired");
            return;
        }

        const responseData = await response.json();
        const userName =
            responseData?.data?.userName || responseData?.userName || "User";

        const loginSelect = document.createElement("select");
        loginSelect.id = "loginSelect";
        loginSelect.className = "login-select";

        const greetingOption = document.createElement("option");
        greetingOption.textContent = `Hello ${userName}!`;
        greetingOption.disabled = true;
        greetingOption.selected = true;

        const profileOption = document.createElement("option");
        profileOption.value = "profile";
        profileOption.textContent = "Profile";

        const logoutOption = document.createElement("option");
        logoutOption.value = "logout";
        logoutOption.textContent = "Logout";

        loginSelect.appendChild(greetingOption);
        loginSelect.appendChild(profileOption);
        loginSelect.appendChild(logoutOption);

        const loginBtn = document.getElementById("login-btn");
        if (loginBtn) {
            loginBtn.replaceWith(loginSelect);
        }

        const signinBtn = document.getElementById("signin-btn");
        if (signinBtn) {
            signinBtn.style.display = "none";
        }

        loginSelect.addEventListener("change", goLogin);
    } catch (err) {
        console.error("Network Error:", err);
    }
}

async function goLogin(e) {
    const value = e.target.value;

    switch (value) {
        case "login":
            window.location.href = "/index.html";
            break;

        case "profile":
            window.location.href = "/html/user-profile.html";
            break;

        case "logout":
            try {
                const response = await fetch(`${url}/user/logout`, {
                    method: "POST",
                    credentials: "include",
                });
                const responseData = await response.json();

                if (response.ok) {
                    alert(responseData.message);
                    window.location.href = "/index.html";
                } else {
                    showMessage(responseData.message, false);
                    console.error(responseData);
                }
            } catch (err) {
                console.error("Logout Error:", err);
            }
            break;

        default:
            console.log("No action");
    }
}

window.addEventListener("DOMContentLoaded", displayUserName);
