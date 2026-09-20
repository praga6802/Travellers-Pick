const form = document.getElementById("signup-form");
form.addEventListener("submit", handleSignUp);
const error = document.getElementById("error");

async function handleSignUp(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const contact = document.getElementById("contact").value;

    const data = { username, email, password, contact };
    try {
        const response = await fetch("http://localhost:8080/user/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        if (response.ok) {
            error.textContent = responseData.message;
            error.classList.remove("failure");
            error.classList.add("success");
            setTimeout(() => {
                form.reset();
                window.location.href = "../html/user-login.html";
            }, 2000);
        } else {
            error.textContent = responseData.message;
            error.classList.remove("success");
            error.classList.add("failure");

            console.error("Backend Error:", responseData);
        }
    } catch (err) {
        error.innerText = "Network error. Please try again";
        error.classList.add("failure");
        console.error(err);
    }
}

form.addEventListener("reset", () => {
    error.style.display = "none";
    document.getElementById("username").innerText = "";
    document.getElementById("email").innerText = "";
    document.getElementById("password").innerText = "";
    document.getElementById("contact").innerText = "";
});
