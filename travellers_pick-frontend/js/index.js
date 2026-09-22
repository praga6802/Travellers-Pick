const BASE_URL = "https://travellers-pick-production.up.railway.app";
const form = document.getElementById("login-form");
const error = document.getElementById("error");

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

if (form) {
    form.addEventListener("submit", handleLogin);
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const data = { email, password };

    try {
        const response = await fetch(`${BASE_URL}/user/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include",
        });

        const responseData = await response.json();

        if (response.ok) {
            if (error) {
                error.textContent = responseData.message || "Login successful!";
                error.classList.remove("failure");
                error.classList.add("success");
            }
            setTimeout(() => {
                window.location.href = "/index.html";
            }, 1500);
        } else {
            if (error) {
                error.textContent = responseData.message || "Login failed!";
                error.classList.remove("success");
                error.classList.add("failure");
            }
            console.log("Backend error:", responseData);
        }
    } catch (err) {
        if (error) {
            error.textContent = "Network error.. Please try again..";
            error.classList.remove("success");
            error.classList.add("failure");
        }
        console.error(err);
    }
}

async function displayUserName() {
    try {
        const response = await fetch(`${BASE_URL}/user/current-user`, {
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
                const response = await fetch(`${BASE_URL}/user/logout`, {
                    method: "POST",
                    credentials: "include",
                });

                if (response.ok) {
                    alert("Logged out successfully!");
                    window.location.href = "/index.html";
                } else {
                    alert("Logout failed!");
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
