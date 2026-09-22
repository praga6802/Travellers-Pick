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

const displayBookedUsers = async () => {
    try {
        const response = await fetch(`${url}/admin/allregusers`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        const responseData = await response.json();

        if (!response.ok) {
            showMessage(
                responseData.message || "Failed to fetch booked users.",
                false,
            );
            console.error(response);
            return;
        }

        const usersList = Array.isArray(responseData)
            ? responseData
            : responseData.data;

        if (!usersList || !Array.isArray(usersList) || usersList.length === 0) {
            showMessage("No booked users found.", false);
            return;
        }

        const bookedUsersContainer = document.getElementById(
            "booked-users-container",
        );
        if (!bookedUsersContainer) return;

        bookedUsersContainer.innerHTML = `
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
                <tbody id="user-container">
                </tbody>
            </table>
        `;

        const userContainer = document.getElementById("user-container");

        usersList.forEach((user) => {
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
                    td.style.fontWeight = "bold";
                });
            }

            userContainer.appendChild(row);
        });
    } catch (err) {
        showMessage("Network error..Please try again", false);
        console.error(err);
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    const isAuthenticated = await displayCurrentAdmin();
    if (isAuthenticated) {
        await displayBookedUsers();
    }
});
