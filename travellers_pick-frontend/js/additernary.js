import { showFormMessage, showSessionMessage } from "./error.js";
import { url } from "./config.js";

const itineraryContainer = document.getElementById("itinerary-container");

const displayItineraryForm = async () => {
    try {
        const authResponse = await fetch(`${url}/admin/current-admin`, {
            method: "GET",
            credentials: "include",
        });

        const authResponseData = await authResponse.json();

        if (!authResponse.ok) {
            itineraryContainer.style.display = "none";
            showSessionMessage(authResponseData.message, false);

            setTimeout(() => {
                window.location.href = "../html/admin-login.html";
            }, 2000);

            return;
        }

        itineraryContainer.innerHTML = `
            <form id="addItineraryForm">
                <legend>ADD ITINERARY</legend>

                <div class="input">
                    <label for="package-select">Package Name</label>
                    <select name="package-name" id="package-select">
                        <option selected disabled hidden value="">
                            Select Package
                        </option>
                    </select>
                </div>

                <div class="input">
                    <label for="tour-select">Tour Name</label>
                    <select name="tour-name" id="tour-select">
                        <option selected disabled hidden value="">
                            Select Tour
                        </option>
                    </select>
                </div>

                <div class="input">
                    <label for="day">Day</label>
                    <input
                        type="number"
                        name="day"
                        id="day"
                        min="1"
                        class="input-box"
                    >
                </div>

                <div class="input">
                    <label for="destination">Destination</label>
                    <input
                        type="text"
                        name="destination"
                        id="destination"
                        class="input-box"
                        placeholder="Destination"
                    >
                </div>

                <div class="input">
                    <label for="description">Description</label>
                    <input
                        type="text"
                        name="description"
                        id="description"
                        class="input-box"
                        placeholder="Add your Description"
                    >
                </div>

                <div id="button-group">
                    <button class="button" type="submit">ADD</button>
                    <button class="button" type="reset">RESET</button>
                </div>

                <p id="form-error"></p>
            </form>
        `;

        const packageNameSelect = document.getElementById("package-select");

        const addItineraryForm = document.getElementById("addItineraryForm");

        if (!packageNameSelect) return;

        const packageResponse = await fetch(`${url}/admin/packageNames`, {
            method: "GET",
            credentials: "include",
        });

        const packageResponseData = await packageResponse.json();

        if (!packageResponse.ok) {
            itineraryContainer.style.display = "none";
            showSessionMessage("Failed to load packages", false);
            return;
        }

        if (packageResponseData.length === 0) {
            itineraryContainer.style.display = "none";
            showSessionMessage("No packages available", false);
            return;
        }

        packageResponseData.forEach((pkg) => {
            const option = document.createElement("option");

            option.value = pkg.packageId;
            option.textContent = pkg.packageName;

            packageNameSelect.appendChild(option);
        });

        packageNameSelect.addEventListener("change", async () => {
            const packageId = packageNameSelect.value;
            const tourSelect = document.getElementById("tour-select");

            if (!tourSelect) return;

            tourSelect.innerHTML = `
                <option selected disabled hidden value="">
                    Select Tour
                </option>
            `;

            const tourResponse = await fetch(
                `${url}/admin/tourNames/${packageId}`,
                {
                    method: "GET",
                    credentials: "include",
                },
            );

            const tourResponseData = await tourResponse.json();

            if (!tourResponse.ok) {
                showSessionMessage("Failed to load tours!", false);
                return;
            }

            if (tourResponseData.length === 0) {
                showSessionMessage("No tours available!", false);
                return;
            }

            tourResponseData.forEach((tour) => {
                const option = document.createElement("option");

                option.value = tour.tourId;
                option.textContent = tour.tourName;

                tourSelect.appendChild(option);
            });
        });

        addItineraryForm.addEventListener("submit", addItinerary);
    } catch (err) {
        showSessionMessage("Network error..Please try again!", false);
        console.error(err);
        return;
    }
};

const addItinerary = async (e) => {
    e.preventDefault();

    const formError = document.getElementById("form-error");
    const addItineraryForm = e.target;

    const packageId = parseInt(
        document.getElementById("package-select").value,
        10,
    );

    const tourId = parseInt(document.getElementById("tour-select").value, 10);

    const day = parseInt(document.getElementById("day").value.trim(), 10);

    const destination = document.getElementById("destination").value.trim();

    const description = document.getElementById("description").value.trim();

    if (
        !packageId ||
        !tourId ||
        !day ||
        day < 1 ||
        !destination ||
        !description
    ) {
        showFormMessage("Please fill all fields", false);
        return;
    }

    const data = {
        packageId,
        tourId,
        day,
        destination,
        description,
    };

    try {
        const addItineraryResponse = await fetch(
            `${url}/admin/addItinerary`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            },
        );

        const addItineraryResponseData = await addItineraryResponse.json();

        if (!addItineraryResponse.ok) {
            showFormMessage(addItineraryResponseData.message, false);
            return;
        }

        showFormMessage(addItineraryResponseData.message, true);

        setTimeout(() => {
            addItineraryForm.reset();
            formError.style.display = "none";
        }, 2000);
    } catch (err) {
        console.error(err);
        showFormMessage("Network error..Please try again", false);
    }
};

document.addEventListener("DOMContentLoaded", displayItineraryForm);
