const form = document.getElementById("login-form");
form.addEventListener("submit", handleLogin);
const error = document.getElementById("error");

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const data = { email, password };

    try {
        const response = await fetch("http://localhost:8080/admin/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include",
        });

        const responseData = await response.json();
        if (response.ok) {
            error.textContent = responseData.message;
            error.classList.remove("failure");
            error.classList.add("success");
            setTimeout(() => {
                window.location.href = "../html/admin-home.html";
            }, 2000);
        } else {
            error.innerText = responseData.message;
            error.classList.remove("success");
            error.classList.add("failure");

            console.log(responseData);
        }
    } catch (err) {
        error.innerText = "Network Error..Please try again";
        error.classList.remove("success");
        error.classList.add("failure");
        console.error(err);
    }
}

form.addEventListener("reset", () => {
    error.style.display = "none";
});
