import { showFormMessage, showSessionMessage } from "./error.js";
import { url } from "./config.js";

const tourContainer = document.getElementById("tour-container");
const displayCurrentAdmin = async () => {
    try {
        const response = await fetch(`${url}/admin/current-admin`, {
            method: "GET",
            credentials: "include",
        });
        const responseData = await response.json();

        if (!response.ok) {
            tourContainer.style.display = "none";
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

const displayTours = async () => {
    try {
        const response = await fetch(`${url}/admin/allCategories`, {
            method: "GET",
            credentials: "include",
        });

        const responseData = await response.json();

        if (!response.ok) {
            showSessionMessage("Failed to fetch tours", false);
            console.error(response);
            return;
        }

        if (responseData.length === 0) {
            showSessionMessage("No tours found!", false);
            return;
        }

        tourContainer.innerHTML = `
            <h1 class="h1">VIEW TOURS</h1>
            <table id="viewcategory">
                <thead>
                    <tr id="head-data">
                        <th class="data">Tour ID</th>
                        <th class="data">Package ID</th>
                        <th>Tour Name</th>
                        <th>Tour Slogan</th>
                        <th>Places</th>
                        <th class="data">Price</th>
                        <th class="data">Days</th>
                        <th class="data">Nights</th>
                    </tr>
                </thead>
                <tbody id="tour-body">
                </tbody>
            </table>
        `;

        const tourBody = document.getElementById("tour-body");

        toursList.forEach((tour) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${tour.tourId || tour.id || "N/A"}</td>
                <td>${tour.packageId || tour.pkgId || "N/A"}</td>
                <td>${tour.tourName || tour.name || "N/A"}</td>
                <td>${tour.tourSlogan || tour.slogan || "N/A"}</td>
                <td>${tour.places || "N/A"}</td>
                <td>${tour.price || "N/A"}</td>
                <td>${tour.days || 0}</td>
                <td>${tour.nights || 0}</td>
            `;
            tourBody.appendChild(row);
        });
    } catch (err) {
        showFormMessage("Network error..Please try again", false);
        console.error(err);
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    const isAuthenticated = await displayCurrentAdmin();
    if (isAuthenticated) {
        await displayTours();
    }
});
