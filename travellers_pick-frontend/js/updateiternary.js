import { showFormMessage, showSessionMessage } from "./error.js";
import { url } from "./config.js";

const itineraryContainer = document.getElementById("itinerary-container");
let itineraryId = null;

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
            <form id="updateItineraryForm">
                <legend>UPDATE ITINERARY</legend>

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
                    <label for="day-select">Day</label>
                    <select name="day" id="day-select">
                        <option selected disabled hidden value="">
                            Select Day
                        </option>
                    </select>
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
                    <button class="button" type="submit">UPDATE</button>
                    <button class="button" type="reset">RESET</button>
                </div>

                <p id="form-error"></p>
            </form>
        `;

        const packageNameSelect = document.getElementById("package-select");
        const tourSelect = document.getElementById("tour-select");
        const daySelect = document.getElementById("day-select");
        const updateItineraryForm = document.getElementById(
            "updateItineraryForm",
        );

        if (!packageNameSelect) return;

        //get packages
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

        //dynamic tour name from package select
        packageNameSelect.addEventListener("change", async () => {
            const packageId = packageNameSelect.value;
            tourSelect.innerHTML = `
                <option selected disabled hidden value="">
                    Select Tour
                </option>
            `;

            daySelect.innerHTML = `
            <option selected disabled hidden value="">
                Select Day
            </option>
            `;
            document.getElementById("destination").value = "";
            document.getElementById("description").value = "";

            try {
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
            } catch (err) {
                console.error(err);
                showSessionMessage("Failed to load tours!", false);
            }
        });

        tourSelect.addEventListener("change", async () => {
            const packageId = packageNameSelect.value;
            const tourId = tourSelect.value;

            daySelect.innerHTML = `
                <option selected disabled hidden value="">
                    Select Day
                </option>
            `;
            document.getElementById("destination").value = "";
            document.getElementById("description").value = "";

            try {
                const itineraryResponse = await fetch(
                    `${url}/admin/getDay/${packageId}/${tourId}`,
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );

                const itineraryResponseData = await itineraryResponse.json();

                console.log(itineraryResponse);
                console.log(itineraryResponseData);

                if (!itineraryResponse.ok) {
                    showFormMessage("Failed to load itineraries!", false);
                    return;
                }

                if (
                    !itineraryResponseData ||
                    itineraryResponseData.length === 0
                ) {
                    showFormMessage("No Days found!", false);
                    return;
                }

                itineraryResponseData.forEach((itinerary) => {
                    const option = document.createElement("option");
                    option.value = itinerary.day;
                    option.textContent = `Day ${itinerary.day}`;
                    daySelect.appendChild(option);
                });
            } catch (err) {
                console.error(err);
                showFormMessage("Failed to load days!", false);
            }
        });

        daySelect.addEventListener("change", async () => {
            const packageId = packageNameSelect.value;
            const tourId = tourSelect.value;
            const day = daySelect.value;

            try {
                const itineraryResponse = await fetch(
                    `${url}/admin/getItinerary/${packageId}/${tourId}/${day}`,
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );

                const itineraryResponseData = await itineraryResponse.json();

                if (!itineraryResponse.ok) {
                    showFormMessage("Failed to load itinerary!", false);
                    return;
                }
                itineraryId = itineraryResponseData.itineraryId;
                document.getElementById("destination").value =
                    itineraryResponseData.destination;

                document.getElementById("description").value =
                    itineraryResponseData.description;
            } catch (err) {
                console.error(err);
                showFormMessage("Network error..Please try again!", false);
            }
        });

        updateItineraryForm.addEventListener("submit", updateItinerary);
    } catch (error) {
        showSessionMessage("Network error..Please try again!");
        console.error(error);
    }
};

// sending update details
const updateItinerary = async (e) => {
    e.preventDefault();

    const formError = document.getElementById("form-error");
    const updateItineraryForm = e.target;

    const packageId = parseInt(
        document.getElementById("package-select").value,
        10,
    );

    const tourId = parseInt(document.getElementById("tour-select").value, 10);

    const day = parseInt(
        document.getElementById("day-select").value.trim(),
        10,
    );

    const destination = document.getElementById("destination").value.trim();

    const description = document.getElementById("description").value.trim();

    if (!packageId || !tourId || !day || !destination || !description) {
        showFormMessage("Please fill all fields", false);
        return;
    }

    const data = {};
    data.itineraryId = itineraryId;
    if (packageId) data.packageId = packageId;
    if (tourId) data.tourId = tourId;
    if (day) data.day = day;
    if (description) data.description = description;
    if (destination) data.destination = destination;

    try {
        const updateItineraryResponse = await fetch(
            `${url}/admin/updateItinerary`,
            {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            },
        );

        const updateItineraryResponseData =
            await updateItineraryResponse.json();

        if (!updateItineraryResponse.ok) {
            showFormMessage(updateItineraryResponseData.message, false);
            return;
        }

        showFormMessage(updateItineraryResponseData.message, true);

        setTimeout(() => {
            updateItineraryForm.reset();
            formError.style.display = "none";
        }, 2000);
    } catch (err) {
        console.error(err);
        showFormMessage("Network error..Please try again", false);
    }
};

document.addEventListener("DOMContentLoaded", displayItineraryForm);
