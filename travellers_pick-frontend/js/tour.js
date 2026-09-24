import { showFormMessage, showSessionMessage } from "./error.js";
import { url, uiUrl } from "./config.js";

const tourContainer = document.getElementById("packageTourContainer");

const displayTour = async () => {
    try {
        const authResponse = await fetch(`${url}/user/current-user`, {
            method: "GET",
            credentials: "include",
        });

        const authData = await authResponse.json();

        if (!authResponse.ok) {
            tourContainer.style.display = "none";
            showSessionMessage(authData.message, false);
            setTimeout(() => {
                window.location.href = "../html/user-login.html";
            }, 2000);
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

        const params = new URLSearchParams(window.location.search);
        const packageId = parseInt(params.get("packageId"));

        const packageTours = tourData.filter(
            (tour) => tour.packageId === packageId,
        );

        if (packageTours.length === 0) {
            tourContainer.style.display = "none";
            showSessionMessage("No tours found for this package!", false);
            return;
        }

        packageTours.forEach((tour) => {
            tourContainer.innerHTML = `
            <div class='card'>
                <img src="${url}${tour.imgUrl}" alt="${tour.tourName}">
                <h4>${tour.tourName}</h4>
                <h6>${tour.tourSlogan}</h6>
                <i style="font-size:24px" class="fa">&#xf041;</i>
                <p>${tour.places}</p>
                <span class="package-name"> <i style="font-size:24px" class="fa">&#xf017;</i> Days: ${tour.days} - Nights: ${tour.nights}</span>
                <p id='price'>Price: Rs.${tour.price}</p>
			    <button class="book-button">BOOK NOW</button>
		    </div>
            `;
            const cards = tourContainer.querySelectorAll(".card");
            const currentCard = cards[cards.length - 1];

            const bookButton = currentCard.querySelector(".book-button");
            bookButton.addEventListener("click", () => {
                bookTour(tour.fileName);
            });
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
