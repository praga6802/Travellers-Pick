// Signin button
const signin = document.getElementById("signin-btn");
const login = document.getElementById("login-btn");
const url = "../travellers_pick-frontend/html";

if (signin) {
    signin.addEventListener("click", () => {
        window.location.href = `${url}/user-signup.html`;
    });
}

if (login) {
    login.value = "login";
    login.addEventListener("click", goLogin);
}

// Login / Profile / Logout actions
async function goLogin(e) {
    const value = e.target.value;

    switch (value) {
        case "login":
            window.location.href = `${url}/user-login.html`;
            break;

        case "profile":
            window.location.href = `${url}/user-profile.html`;
            break;

        case "logout":
            try {
                const response = await fetch(
                    "http://localhost:8080/user/logout",
                    {
                        method: "POST",
                        credentials: "include",
                    },
                );
                if (response.ok) {
                    alert("Logged out successfully!");
                    window.location.href = `${url}/user-login.html`;
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

// Display logged-in username -- by default this action will perform
async function displayUserName() {
    try {
        const response = await fetch("http://localhost:8080/user/userData", {
            method: "GET",
            credentials: "include",
        });
        const data = await response.json();

        if (!response.ok) {
            console.error("Error:", data.message);
            return;
        }

        // After login - Create select dropdown
        const loginSelect = document.createElement("select");
        loginSelect.id = "loginSelect";
        loginSelect.className = "login-select";

        // 3 options - greeting, user profile and logout
        // Greeting option
        const greetingOption = document.createElement("option");
        greetingOption.textContent = `Hello ${data.username}!`;
        greetingOption.disabled = true;
        greetingOption.selected = true;

        // Profile option
        const profileOption = document.createElement("option");
        profileOption.value = "profile";
        profileOption.textContent = "User Profile";

        // Logout option
        const logoutOption = document.createElement("option");
        logoutOption.value = "logout";
        logoutOption.textContent = "Logout";

        // Append options to dropdown (select)
        loginSelect.appendChild(greetingOption);
        loginSelect.appendChild(profileOption);
        loginSelect.appendChild(logoutOption);

        // after login
        //Replace login button - select dropdown
        const loginBtn = document.getElementById("login-btn");

        if (loginBtn) {
            loginBtn.replaceWith(loginSelect);
        }

        // Hide signin button
        const signinBtn = document.getElementById("signin-btn");

        if (signinBtn) {
            signinBtn.style.display = "none";
        }

        // Add event listener to select
        loginSelect.addEventListener("change", goLogin);
    } catch (err) {
        console.log("Network Error:", err);
    }
}

// Run after page load
window.addEventListener("DOMContentLoaded", displayUserName);
