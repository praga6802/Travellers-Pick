import { showFormMessage, showSessionMessage } from "./error.js";
import { url } from "./config.js";

const userContainer = document.getElementById("user-container");
const displayCurrentAdmin = async () => {
    try {
        const response = await fetch(`${url}/admin/current-admin`, {
            method: "GET",
            credentials: "include",
        });
        const responseData = await response.json();

        if (!response.ok) {
            userContainer.style.display = "none";
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

const displayUsers = async () => {
    try {
        const response = await fetch(`${url}/admin/users`, {
            method: "GET",
            credentials: "include",
        });

        const responseData = await response.json();

        if (!response.ok) {
            showSessionMessage("Failed to fetch users", false);
            console.error(response);
            return;
        }

        if (responseData.length == 0 || !responseData) {
            showSessionMessage("No users found");
            return;
        }

        userContainer.innerHTML = `
     		<div class="container">
			<div class="row justify-content-center">
				<div class="col-12 col-md-8 col-lg-6">
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
				</div>
			</div>
		</div>
        `;

        const userBody = document.getElementById("user-body");

        responseData.data.forEach((user) => {
            const userRow = document.createElement("tr");
            userRow.innerHTML = `
                <td>${user.userId}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.contact}</td>
            `;
            userBody.appendChild(userRow);
        });
    } catch (err) {
        showFormMessage("Network error..Please try again", false);
        console.error(err);
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    const isAuthenticated = await displayCurrentAdmin();
    if (isAuthenticated) {
        await displayUsers();
    }
});
