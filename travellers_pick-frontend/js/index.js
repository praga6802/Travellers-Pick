const signin = document.getElementById("signin-btn");
const login = document.getElementById("login-btn");

if (signin) {
    signin.addEventListener("click", () => {
        window.location.href = `./html/user-signup.html`;
    });
}

if (login) {
    login.addEventListener("click", () => {
        window.location.href = `./html/user-login.html`;
    });
}
async function goLogin(e) {
    const value = e.target.value;

    switch (value) {
        case "login":
            window.location.href = `./html/user-login.html`;
            break;

        case "profile":
            window.location.href = `./html/user-profile.html`;
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
                    window.location.href = "./index.html";
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

async function displayUserName() {
    try {
        const response = await fetch(
            "http://localhost:8080/user/current-user",
            {
                method: "GET",
                credentials: "include",
            },
        );

        const data = await response.json();
        if (!response.ok) {
            console.log("User not logged in");
            return;
        }

        const loginSelect = document.createElement("select");

        loginSelect.id = "loginSelect";
        loginSelect.className = "login-select";

        const greetingOption = document.createElement("option");
        greetingOption.textContent = `Hello ${data.data.userName}!`;
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
window.addEventListener("DOMContentLoaded", displayUserName);
