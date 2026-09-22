import { showMessage } from "./error.js";
import { url } from "./config.js";
const displayCurrentAdmin = async () => {
    try {
        const authResponse = await fetch(`${url}/admin/current-admin`, {
            method: "GET",
            credentials: "include",
        });
        const authData = await authResponse.json();

        if (!authResponse.ok) {
            showMessage(authData.message, false);
            setTimeout(() => {
                window.location.href = "../html/loginform.html";
            }, 1500);
            return;
        }

        //if current admin logged in create update package form
        const adminContainer = document.getElementById("admin-container");
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
            </form>
        `;

        document.getElementById("adminId").value = authData.adminId || "";
        document.getElementById("username").value = authData.username || "";
        document.getElementById("email").value = authData.email || "";
        document.getElementById("contact").value = authData.contact || "";

        const updateform = document.getElementById("updateAdmin");
        updateform.addEventListener("submit", handleUpdate);
    } catch (err) {
        showMessage("Network error..Please try again");
        console.error(err);
    }
};

const handleUpdate = async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const contact = document.getElementById("contact").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!password) {
        showMessage("Password is required to update details", false);
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
            showMessage(responseData.message, false);
            console.error(responseData);
            return;
        }
        showMessage(responseData.message, true);
        document.getElementById("password").value = "";
    } catch (err) {
        showMessage("Network error..Please try again!");
        console.error(err);
    }
};

document.addEventListener("DOMContentLoaded", displayCurrentAdmin);
