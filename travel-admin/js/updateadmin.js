const error = document.getElementById('error');

window.addEventListener('DOMContentLoaded', async () => {
    const input = document.getElementById("adminId");

    try {
        const response = await fetch("http://localhost:8080/admin/current-admin", {
            method: "GET",
            credentials: "include"
        });

        if (response.ok) {
            const data = await response.json();
            input.value = data.adminId;
        } else {
            error.style.color = "red";
            error.innerText = "Unable to fetch admin details";
            window.location.href="loginform.html";
        }
    } catch (err) {
        error.innerText = "Network Error..Please Try again";
        error.style.color = "red";
    }
});

// update admin
const form = document.getElementById("updateAdmin");
form.addEventListener('submit', handleUpdateAdmin);

async function handleUpdateAdmin(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const contact = document.getElementById("contact").value.trim();
    const password = document.getElementById('password').value.trim();

    if (!password) {
        error.innerText = 'Password is required to update details';
        error.style.color = 'red';
        return;
    }

    // Prepare payload
    const payload = { password };
    if (username) payload.username = username;
    if (email) payload.email = email;
    if (contact) payload.contact = contact;

    try {
        const response = await fetch("http://localhost:8080/admin/updateAdmin", {
            method: "POST",
            headers: { 'Content-Type': "application/json" },
            credentials: "include",
            body: JSON.stringify(payload)
        });

        const responseData = await response.json();

        error.innerText = responseData.message;
        error.style.color = response.ok ? "green" : "red";
        error.style.textAlign = "center";
        error.style.marginTop = "50px";

        // Reset form after 3 seconds
        setTimeout(() => form.reset(), 3000);

    } catch (err) {
        error.innerText = "Network Error..Please Try again";
        error.style.color = 'red';
    }
}
