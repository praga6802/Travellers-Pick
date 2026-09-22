import { showMessage } from "./error.js";
import { url } from "./config.js";
const displayCurrentAdmin = async () => {
    try {
        const response = await fetch(`${url}/admin/current-admin`, {
            method: "GET",
            credentials: "include",
        });
        const responseData = await response.json();

        if (!response.ok) {
            showMessage(
                responseData.message || "Session expired. Please login again.",
                false,
            );
            setTimeout(() => {
                window.location.href = "../html/loginform.html";
            }, 1500);
            return false;
        }
        return true;
    } catch (err) {
        showMessage("Network error..Please try again", false);
        console.error(err);
        return false;
    }
};

const displayUsers = async () => {
    try {
        const response = await fetch(`${url}/admin/allusers`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        const responseData = await response.json();

        if (!response.ok) {
            showMessage(responseData.message || "Failed to fetch users", false);
            console.error(response);
            return;
        }

        const usersList = Array.isArray(responseData)
            ? responseData
            : responseData.data;

        if (!usersList || !Array.isArray(usersList) || usersList.length === 0) {
            showMessage("No users found.", false);
            return;
        }

        const userContainer = document.getElementById("user-container");
        if (!userContainer) return;

        userContainer.innerHTML = `
            <h1 class="h1">USER INFO</h1>
            <table id="usertable">
                <thead>
                    <tr>
                        <th id="pkgid">ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile Number</th>
                    </tr>
                </thead>
                <tbody id="user-body">
                </tbody>
            </table>
        `;

        const userBody = document.getElementById("user-body");

        usersList.forEach((user) => {
            const userRow = document.createElement("tr");
            userRow.innerHTML = `
                <td>${user.id || user.userId || "N/A"}</td>
                <td>${user.username || user.userName || user.name || "N/A"}</td>
                <td>${user.email || "N/A"}</td>
                <td>${user.contact || user.phone || "N/A"}</td>
            `;
            userBody.appendChild(userRow);
        });
    } catch (err) {
        showMessage("Network error..Please try again", false);
        console.error(err);
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    const isAuthenticated = await displayCurrentAdmin();
    if (isAuthenticated) {
        await displayUsers();
    }
});
