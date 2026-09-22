import { showMessage } from "./error.js";

const displayTour = async () => {
    try {
        const authResponse = await fetch(`${url}/user/current-user`, {
            method: "GET",
        });

        const authData = await authResponse.json();

        if (!authResponse.ok) {
            showMessage(authData.message, false);
            return;
        }

        const tourResponse = await fetch(`${url}/admin/allCategories`, {
            method: "GET",
            credentials: "include",
        });

        const tourData = await tourResponse.json();

        if (!tourResponse.ok) {
            showMessage(tourData.message, false);
            return;
        }

        if (tourData.length === 0) {
            showMessage(tourData.message, false);
            return;
        }

        const url = new URLSearchParams(window.location.search);
        const packageId = parseInt(url.get("packageId"));

        const packageTours = tourData.filter(
            (tour) => tour.packageId === packageId,
        );

        const tourContainer = document.getElementById("packageTourContainer");

        if (packageTours.length === 0) {
            showMessage("No tours found for this package!", false);
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
			    <button class="book-button" onclick="bookTour('${t.fileName}')">BOOK NOW</button>
		    </div>
            `;
        });
    } catch (error) {
        showMessage("Network error..Please try again");
        console.error(error);
    }
};

function bookTour(value) {
    window.location.href = `../html/${value}`;
}

document.addEventListener("DOMContentLoaded", displayTour);
