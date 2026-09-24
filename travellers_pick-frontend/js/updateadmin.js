import { showFormMessage, showSessionMessage } from "./error.js";
import { url } from "./config.js";

const adminContainer = document.getElementById("admin-container");
const displayCurrentAdmin = async () => {
    try {
        const authResponse = await fetch(`${url}/admin/current-admin`, {
            method: "GET",
            credentials: "include",
        });
        const authData = await authResponse.json();

        if (!authResponse.ok) {
            adminContainer.style.display = "none";
            showSessionMessage(authData.message, false);
            setTimeout(() => {
                window.location.href = "../html/admin-login.html";
            }, 1500);
            return;
        }
        adminContainer.innerHTML = `
            <form id="updateAdmin">
                <legend>UPDATE ADMIN</legend>
                <label for="adminId">Admin ID</label>
                <input type="text" name="adminId" id="adminId" placeholder="Admin ID" disabled><br><br>
                <label for="username">User Name</label>
                <input type="text" name="username" id="username" placeholder="Full Name" /><br><br>

                <label for="password">Password</label>
                <input type="password" name="password" id="password" pattern="[A-Za-z0-9!@#$%^&*\(\)]{6,16}"
                    placeholder="Password" required><br><br>

                <label for="email">Email</label>
                <input type="email" name="email" id="email" placeholder="Email ID"><br><br>

                <label for="contact">Mobile Number</label>
                <input type="tel" name="contact" id="contact" pattern="[0-9]{1,10}" maxlength="10"
                    placeholder="10- digit Number"><br><br>

                <input type="submit" value="UPDATE" name="submit" class="button" />
                <input type="reset" value="RESET" name="reset" class="button" />

                <p id="form-error"></p>
            </form>
        `;

        document.getElementById("adminId").value = authData.adminId || "";
        document.getElementById("username").value = authData.username || "";
        document.getElementById("email").value = authData.email || "";
        document.getElementById("contact").value = authData.contact || "";

        const updateform = document.getElementById("updateAdmin");
        updateform.addEventListener("submit", handleUpdate);
    } catch (err) {
        showSessionMessage("Network error..Please try again");
        console.error(err);
    }
};

const handleUpdate = async (e) => {
    e.preventDefault();
    const updateAdminform = e.target;
    const formMessage = document.getElementById("form-error");

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const contact = document.getElementById("contact").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!password) {
        showFormMessage("Password is required to update details", false);
        return;
    }

    // Prepare payload
    const data = { password };
    if (username) data.username = username;
    if (email) data.email = email;
    if (contact) data.contact = contact;

    try {
        const response = await fetch(`${url}/admin/updateAdmin`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            showFormMessage(responseData.message, false);
            console.error(responseData);
            return;
        }
        showFormMessage(responseData.message, true);

        setTimeout(() => {
            formMessage.classList.add("hide");
            password.value = "";
        }, 1500);
    } catch (err) {
        showFormMessage("Network error..Please try again!");
        console.error(err);
    }
};

document.addEventListener("DOMContentLoaded", displayCurrentAdmin);
