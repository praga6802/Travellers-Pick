import { showFormMessage, showSessionMessage } from "./error.js";
import { url, uiUrl } from "./config.js";

const tourContainer = document.getElementById("packageTourContainer");
const displayTour = async () => {
    try {
        const authResponse = await fetch(`${url}/user/current-user`, {
            method: "GET",
        });

        const authData = await authResponse.json();

        if (!authResponse.ok) {
            tourContainer.style.display = "none";
            showSessionMessage(authData.message, false);
            return;
        }

        const tourResponse = await fetch(`${url}/admin/allTours`, {
            method: "GET",
            credentials: "include",
        });

        const tourData = await tourResponse.json();

        if (!tourResponse.ok) {
            tourContainer.style.display = "none";
            showSessionMessage("Unable to load tours!", false);
            return;
        }

        const url = new URLSearchParams(window.location.search);
        const packageId = parseInt(url.get("packageId"));

        const packageTours = tourData.filter(
            (tour) => tour.packageId === packageId,
        );

        if (packageTours.length === 0) {
            tourContainer.style.display = "none";
            showSessionMessage("No tours found for this package!", false);
            return;
        }

        packageTours.forEach((t) => {
            tourContainer.innerHTML = `
            <div class='card'>
                <img src="../${t.imgUrl}" alt="${t.tourName}">
                <h4>${t.tourName}</h4>
                <h6>${t.tourSlogan}</h6>
                <i style="font-size:24px" class="fa">&#xf041;</i>
                <p>${t.places}</p>
                <span class="package-name"> <i style="font-size:24px" class="fa">&#xf017;</i> Days: ${t.days} - Nights: ${t.nights}</span>
                <p id='price'>Price: Rs.${t.price}</p>
			    <button class="book-button">BOOK NOW</button>
		    </div>
            `;

            const bookButton = document.querySelector(".book-button");
            bookButton.addEventListener("click",bookTour(t.fileName));
        });
    } catch (error) {
        showSessionMessage("Network error..Please try again");
        console.error(error);
    }
};

function bookTour(fileName) {
    window.location.href = `${uiUrl}/html/${fileName}`;
}

document.addEventListener("DOMContentLoaded", displayTour);
