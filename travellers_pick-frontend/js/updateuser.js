import { showFormMessage, showSessionMessage } from "./error.js";
import { url } from "./config.js";
const updateContainer = document.getElementById("updateform");
const userHeader = document.getElementById("userHeader");
const userLinks = document.querySelector(".user-links");

let oldEmail = "";
let oldUsername = "";
let oldContact = "";

const displayUpdateForm = async () => {
    try {
        const response = await fetch(`${url}/user/current-user`, {
            method: "GET",
            credentials: "include",
        });
        const responseData = await response.json();

        if (!response.ok) {
            userHeader.style.display = "none";
            userLinks.style.display = "none";
            updateContainer.style.display = "none";

            showSessionMessage(responseData.message, false);
            setTimeout(() => {
                window.location.href = "../html/user-login.html";
            }, 1500);
            return;
        }

        updateContainer.innerHTML = `
        <form id="update-form">
            <legend id="update-legend">UPDATE USER INFO</legend>
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

        const userResponse = await fetch(`${url}/user/userData`, {
            method: "GET",
            credentials: "include",
        });

        const userResponseData = await userResponse.json();

        if (!userResponse.ok) {
            showFormMessage("Unable to fetch user data", false);
            return;
        }

        if (!userResponseData) {
            showFormMessage("No user data found!", false);
            return;
        }

        const { username, email, contact } = userResponseData;

        oldUsername = username;
        oldEmail = email;
        oldContact = contact;

        document.getElementById("username").value = username;
        document.getElementById("email").value = email;
        document.getElementById("contact").value = contact;

        const updateForm = document.getElementById("update-form");
        updateForm.addEventListener("submit", handleUpdate);
    } catch (error) {
        showSessionMessage("Network error..Please try again!", false);
        console.error(error);
    }
};

async function handleUpdate(event) {
    event.preventDefault();

    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const contact = document.getElementById("contact");

    const newUserName = username.value.trim();
    const newEmail = email.value.trim();
    const newContact = contact.value.trim();

    const payload = {};
    if (newUserName) payload.username = newUserName;
    if (newEmail) payload.email = newEmail;
    if (newContact) payload.contact = newContact;

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
            showFormMessage(responseData.message, false);
            return;
        }

        showFormMessage(responseData.message, true);

        if (newEmail !== oldEmail) {
            setTimeout(() => {
                window.location.href = "../html/verifyotp.html";
            }, 1500);
            return;
        }

        oldEmail = newEmail;
        oldUsername = newUserName;
        oldContact = newContact;
    } catch (e) {
        console.error("Update Error:", e);
        showFormMessage("Network Error. Please try again.", false);
    }
}

document.addEventListener("DOMContentLoaded", displayUpdateForm);
