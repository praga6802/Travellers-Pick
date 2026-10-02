import { showFormMessage, showSessionMessage } from "./error.js";
import { url } from "./config.js";

const tourContainer = document.getElementById("itinerary-container");
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
        const response = await fetch(`${url}/admin/itineraries`, {
            method: "GET",
            credentials: "include",
        });

        const responseData = await response.json();

        if (!response.ok) {
            showSessionMessage("Failed to fetch itineraries", false);
            console.error(response);
            return;
        }

        if (responseData.length == 0 || !responseData) {
            showSessionMessage("No itineraries found");
            return;
        }
        console.log(response);
        console.log(responseData);

        tourContainer.innerHTML = `
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-md-8 col-lg-6">
                    <h1 class="h1">VIEW ITINERARIES</h1>
                    <table id="viewitinerary">
                        <thead>
                            <tr id="head-data">
                                <th class="data">Package ID</th>
                                <th class="data">Tour ID</th>
                                <th>Day</th>
                                <th>Destination</th>
                                <th class="data">Description</th>
                            </tr>
                        </thead>
                        <tbody id="itinerary-body">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        `;

        const itineraryBody = document.getElementById("itinerary-body");

        responseData.data.forEach((itinerary) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class='itinerary'>${itinerary.packages.packageId}</td>
                <td class='itinerary'>${itinerary.tour.tourId}</td>
                <td class='itinerary'>${itinerary.day}</td>
                <td class='itinerary'>${itinerary.destination}</td>
                <td id="itinerary-description">${itinerary.description}</td>
            `;
            itineraryBody.appendChild(row);
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
