import { showSessionMessage } from "./error.js";
import { url } from "./config.js";

const userContainer = document.getElementById("booked-user-container");

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

const displayBookedUsers = async () => {
    try {
        const response = await fetch(`${url}/admin/allregusers`, {
            method: "GET",
            credentials: "include",
        });

        const responseData = await response.json();

        if (!response.ok) {
            showSessionMessage("Failed to fetch booked users.", false);
            console.error(response);
            return;
        }

        if (responseData.length === 0) {
            showSessionMessage("No booked users found.", false);
            return;
        }

        if (!userContainer) return;

        userContainer.innerHTML = `
            <h1 class="h1">TOUR BOOKED USERS</h1>
            <table id="regtable">
                <thead>
                    <tr id="head-data">
                        <th class="data">Customer ID</th>
                        <th>Customer Name</th>
                        <th class="data">Email</th>
                        <th class="data">Phone</th>
                        <th class="data">Price</th>
                        <th>Package Name</th>
                        <th>Region</th>
                        <th class="data">Booking Date</th>
                        <th class="data">Travel Date</th>
                        <th class="data">No Of Seats</th>
                        <th class="data">No of Adults</th>
                        <th class="data">No of Children</th>
                        <th class="data">City</th>
                        <th>State</th>
                        <th class="data">Country</th>
                        <th class="data">Status</th>
                    </tr>
                </thead>
                <tbody id="booked-users-body">
                </tbody>
            </table>
        `;
        const userBody = document.getElementById("booked-users-body");
        responseData.forEach((user) => {
            const row = document.createElement("tr");

            const formattedBdate =
                user.bdate || user.bookedAt
                    ? new Date(user.bdate || user.bookedAt).toLocaleDateString()
                    : "N/A";
            const formattedTdate =
                user.tdate || user.travelAt
                    ? new Date(user.tdate || user.travelAt).toLocaleDateString()
                    : "N/A";

            row.innerHTML = `
                <td>${user.userId || user.id || "N/A"}</td>
                <td>${user.userName || user.name || "N/A"}</td>
                <td>${user.email || "N/A"}</td>
                <td>${user.phone || user.contact || "N/A"}</td>
                <td>${user.price || "N/A"}</td>
                <td>${user.packageName || "N/A"}</td>
                <td>${user.tourName || user.region || "N/A"}</td>
                <td>${formattedBdate}</td>
                <td>${formattedTdate}</td>
                <td>${user.noOfSeats || 0}</td>
                <td>${user.noOfAdults || 0}</td>
                <td>${user.noOfChildren || 0}</td>
                <td>${user.city || "N/A"}</td>
                <td>${user.state || "N/A"}</td>
                <td>${user.country || "N/A"}</td>
                <td>${user.status || "UNKNOWN"}</td>
            `;

            if (user.status && user.status.toUpperCase() === "CANCELLED") {
                row.querySelectorAll("td").forEach((td) => {
                    td.style.color = "red";
                    td.style.fontWeight = "500";
                });
            }

            userBody.appendChild(row);
        });
    } catch (err) {
        showSessionMessage("Network error..Please try again", false);
        console.error(err);
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    const isAuthenticated = await displayCurrentAdmin();
    if (isAuthenticated) {
        await displayBookedUsers();
    }
});
