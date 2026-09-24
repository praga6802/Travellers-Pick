import { showFormMessage, showSessionMessage } from "./error.js";
import { url } from "./config.js";

const adminContainer = document.getElementById("admin-container");
const displayAdminForm = async () => {
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
            <form id="delAdmin">
                <legend>DELETE ADMIN</legend>
                
                <label for="adminId">Admin ID</label><br><br>
                <input type="text" name="adminId" id="adminId" placeholder="Admin ID" readonly required><br><br>

                <label for="password">Password</label><br><br>
                <input type="password" name="password" id="password" placeholder="Enter Password to Confirm" required><br><br>

                <div class="button-group">
                    <input type="submit" value="DELETE" name="submit" class="button" />
                    <input type="reset" value="RESET" name="reset" class="button" />
                </div>
                <p id="form-error"></p>
            </form>
        `;

        document.getElementById("adminId").value = authData.adminId;

        const adminForm = document.getElementById("delAdmin");
        adminForm.addEventListener("submit", handleDelete);
    } catch (err) {
        console.error(err);
        showSessionMessage("Network error..Please try again!", false);
    }
};

const handleDelete = async (e) => {
    e.preventDefault();
    const formMessage = document.getElementById("form-error");
    const form = e.target;
    const adminId = document.getElementById("adminId").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!adminId || !password) {
        showFormMessage("Admin ID and Password are required!", false);
        return;
    }

    try {
        const response = await fetch(`${url}/admin/deleteAdmin`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ adminId, password }),
        });

        const responseData = await response.json();

        if (!response.ok) {
            showFormMessage(
                responseData.message || "Unable to delete admin",
                false,
            );
            return;
        }

        showFormMessage(
            responseData.message || "Admin deleted successfully!",
            true,
        );

        setTimeout(() => {
            form.reset();
            formMessage.classList.add("hide");
            window.location.href = "../html/admin-login.html";
        }, 1500);
    } catch (err) {
        showSessionMessage("Network error..Please try again..", false);
        console.error(err);
    }
};

document.addEventListener("DOMContentLoaded", displayAdminForm);
