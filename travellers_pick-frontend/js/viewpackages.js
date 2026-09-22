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

const displayPackages = async () => {
    try {
        const response = await fetch(`${url}/admin/allPackages`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        const responseData = await response.json();

        if (!response.ok) {
            showMessage(
                responseData.message || "Failed to fetch packages",
                false,
            );
            console.error(response);
            return;
        }

        if (Array.isArray(responseData) && responseData.length === 0) {
            showMessage("No packages found.", false);
            return;
        }

        const packageContainer = document.getElementById("package-container");
        if (!packageContainer) return;

        packageContainer.innerHTML = `
            <h1 class="h1">VIEW PACKAGE</h1>
            <table id="packagetable">
                <thead id="head-data">
                    <tr>
                        <th id="pkgid">Package ID</th>
                        <th>Package Name</th>
                        <th>Package Slogan</th>
                    </tr>
                </thead>
                <tbody id="package-body">
                </tbody>
            </table>
        `;

        const packageBody = document.getElementById("package-body");
        responseData.forEach((pkg) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${pkg.packageId || pkg.id || ""}</td>
                <td>${pkg.packageName || ""}</td>
                <td>${pkg.packageSlogan || ""}</td>
            `;
            packageBody.appendChild(row);
        });
    } catch (err) {
        showMessage("Network error..Please try again", false);
        console.error(err);
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    const isAuthenticated = await displayCurrentAdmin();
    if (isAuthenticated) {
        await displayPackages();
    }
});
