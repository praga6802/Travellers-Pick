const login = document.getElementById("login-btn");
const signin = document.getElementById("signin-btn");
const error = document.getElementById("profile-error");

if (error) {
    error.style.display = "none";
}

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
        const response = await fetch(
            "http://localhost:8080/user/current-user",
            {
                method: "GET",
                credentials: "include"
            }
        );

        const data = await response.json();
        if (response.status === 401) {
            error.textContent = data.message;
            error.classList.remove("success");
            error.classList.add("failure");
            error.style.display = "inline-block";
            setTimeout(() => {
            window.location.href ="../html/user-login.html";
            }, 2000);
            return;
        }

        if (!response.ok) {
            error.textContent = data.message;
            error.classList.remove("success");
            error.classList.add("failure");
            error.style.display = "inline-block";
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

        loginSelect.addEventListener("change",goLogin);

    } catch (err) {
        console.error("Network Error:", err);
        error.textContent ="Unable to connect to the server.Please try again later!";
        error.classList.remove("success");
        error.classList.add("failure");
        error.style.display = "inline-block";
    }
}

async function goLogin(e) {
    const value = e.target.value;
    switch (value) {

        case "login":
            window.location.href =
                "../html/user-login.html";
            break;

        case "logout":
            try {
                const response = await fetch(
                    "http://localhost:8080/user/logout",
                    {
                        method: "POST",
                        credentials: "include"
                    }
                );

                if (response.ok) {
                    alert("Logged out successfully!");
                    window.location.href ="../index.html";

                } else {
                    console.error("Logout failed");
                }

            } catch (err) {
                console.error("Error logging out:",err);
            }
            break;

        default:
            console.log("No action");
    }

}

window.addEventListener(
    "DOMContentLoaded",
    displayUserName
);
