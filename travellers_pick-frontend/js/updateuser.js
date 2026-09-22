import { showMessage } from "./error.js";
const updateContainer = document.getElementById("update-form");

let oldEmail = "";
let oldUsername = "";
let oldContact = "";

updateContainer.innerHTML = `
        <h1 id="update-legend">UPDATE USER INFO</h1>
        <form id="update-form">
            <div>
                <label for="username">User Name</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="User Name"
                    class="input">
            </div>

            <div>
                <label for="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    class="input">
            </div>

            <div>
                <label for="contact">Mobile Number</label>
                <input
                    type="tel"
                    id="contact"
                    name="contact"
                    placeholder="Enter 10-digit Number"
                    pattern="[0-9]{10}"
                    class="input">
            </div>

            <div id="button-group">
                <button type="submit" id="submit" class="button">SUBMIT</button>
                <button type="reset" id="reset" class="button">RESET</button>
            </div>
        </form>
    `;

const form = document.getElementById("update-form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const contact = document.getElementById("contact");

window.addEventListener("DOMContentLoaded", displayUserDetails);
if (form) {
    form.addEventListener("submit", handleUpdateUser);
}

async function displayUserDetails() {
    try {
        const response = await fetch(`${url}/user/current-user`, {
            method: "GET",
            credentials: "include",
        });

        const responseData = await response.json();

        if (response.status === 401) {
            showMessage(responseData.message, false);
            if (form) form.style.display = "none";
            setTimeout(() => {
                window.location.href = "../html/user-login.html";
            }, 2000);
            return;
        }

        if (!response.ok) {
            showMessage(responseData.message, false);
            return;
        }

        const { data } = responseData;
        if (data) {
            oldEmail = data.userEmail;
            oldUsername = data.userName;
            oldContact = data.userContact;

            username.value = oldUsername;
            email.value = oldEmail;
            contact.value = oldContact;
        }
    } catch (e) {
        console.error("Network Error:", e);
        showMessage("Network Error. Please login again!", false);
        if (form) form.style.display = "none";
        setTimeout(() => {
            window.location.href = "../html/user-login.html";
        }, 2000);
    }
}

async function handleUpdateUser(event) {
    event.preventDefault();
    const updateUserName = username.value.trim();
    const updateEmail = email.value.trim();
    const updateContact = contact.value.trim();

    const payload = {};
    if (updateUserName) payload.username = updateUserName;
    if (updateEmail) payload.email = updateEmail;
    if (updateContact) payload.contact = updateContact;

    try {
        const response = await fetch(`${url}/user/updateUser`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const responseData = await response.json();

        if (!response.ok) {
            showMessage(
                responseData.message || "Failed to update profile.",
                false,
            );
            return;
        }

        showMessage(
            responseData.message || "Profile updated successfully!",
            true,
        );

        if (updateEmail !== oldEmail) {
            setTimeout(() => {
                window.location.href = "../html/verifyotp.html";
            }, 1500);
            return;
        }

        oldEmail = updateEmail;
        oldUsername = updateUserName;
        oldContact = updateContact;
    } catch (e) {
        console.error("Update Error:", e);
        showMessage("Network Error. Please try again.", false);
    }
}
