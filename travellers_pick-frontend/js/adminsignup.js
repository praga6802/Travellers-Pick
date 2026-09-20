const form = document
    .getElementById("signup-form")
    .addEventListener("submit", handleSignUp);
const error = document.getElementById("error");

async function handleSignUp(event) {
    event.preventDefault();

    const userName = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const contact = document.getElementById("contact").value;

    const data = {
        username: userName,
        email: email,
        password: password,
        contact: contact,
    };
    try {
        const response = await fetch("http://localhost:8080/admin/signup", {
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
                window.location.href = "../html/admin-login.html";
            }, 2000);
        } else {
            error.textContent = responseData.message;
            error.classList.remove("succes");
            error.classList.add("failure");
        }
    } catch (err) {
        error.textContent = "Network error.Please try again";
        error.classList.remove("success");
        error.classList.add("failure");
        console.error(err);
    }
}

form.addEventListener("reset", () => {
    error.style.display = "none";
});
