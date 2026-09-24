import { showFormMessage, showSessionMessage } from "./error.js";
import { url } from "./config.js";

const adminContainer = document.getElementById("admin-container");
const displayCurrentAdmin = async () => {
    try {
        const response = await fetch(`${url}/admin/current-admin`, {
            method: "GET",
            credentials: "include",
        });
        const responseData = await response.json();

        if (!response.ok) {
            adminContainer.style.display = "none";
            showSessionMessage(responseData.message, false);
            setTimeout(() => {
                window.location.href = "../html/admin-login.html";
            }, 1500);
            return false;
        }
        return true;
    } catch (err) {
        showSessionMessage("Network error..Please try again", false);
        console.error(err);
        return false;
    }
};

const displayAdmins = async () => {
    try {
        const response = await fetch(`${url}/admin/alladmins`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        const responseData = await response.json();

        if (!response.ok) {
            showFormMessage("Failed to fetch admins", false);
            console.error(response);
            return;
        }

        if (responseData.length === 0) {
            showFormMessage("No admins found!", false);
            return;
        }

        if (!adminContainer) return;

        adminContainer.innerHTML = `
            <h1 class="h1">ADMIN INFO</h1>
            <table id="admintable">
                <thead>
                    <tr>
                        <th id="pkgid">ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile Number</th>
                    </tr>
                </thead>
                <tbody id="admin-body">
                </tbody>
            </table>
        `;

        const adminBody = document.getElementById("admin-body");

        responseData.forEach((admin) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${admin.adminId || admin.id || ""}</td>
                <td>${admin.username || admin.userName || ""}</td>
                <td>${admin.email || admin.userEmail || ""}</td>
                <td>${admin.contact || admin.userContact || ""}</td>
            `;
            adminBody.appendChild(row);
        });
    } catch (err) {
        showFormMessage("Network error..Please try again", false);
        console.error(err);
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    const isAuthenticated = await displayCurrentAdmin();
    if (isAuthenticated) {
        await displayAdmins();
    }
});
