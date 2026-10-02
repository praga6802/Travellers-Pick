import { showFormMessage, showSessionMessage } from "./error.js";
import { url } from "./config.js";

const packageContainer = document.getElementById("package-container");
const displayCurrentAdmin = async () => {
    try {
        const response = await fetch(`${url}/admin/current-admin`, {
            method: "GET",
            credentials: "include",
        });
        const responseData = await response.json();

        if (!response.ok) {
            packageContainer.style.display = "none";
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

const displayPackages = async () => {
    try {
        const response = await fetch(`${url}/admin/packages`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        const responseData = await response.json();

        if (!response.ok) {
            showSessionMessage("Failed to fetch packages", false);
            console.error(response);
            return;
        }

        if (responseData.length == 0 || !responseData) {
            showSessionMessage("No packages found");
            return;
        }

        packageContainer.innerHTML = `
		<div class="container">
			<div class="row justify-content-center">
				<div class="col-12 col-md-8 col-lg-6">
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
				</div>
			</div>
		</div>
        `;

        const packageBody = document.getElementById("package-body");
        responseData.data.forEach((pkg) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${pkg.packageId || pkg.id || ""}</td>
                <td>${pkg.packageName || ""}</td>
                <td>${pkg.packageSlogan || ""}</td>
            `;
            packageBody.appendChild(row);
        });
    } catch (err) {
        showSessionMessage("Network error..Please try again", false);
        console.error(err);
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    const isAuthenticated = await displayCurrentAdmin();
    if (isAuthenticated) {
        await displayPackages();
    }
});
