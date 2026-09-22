import { showMessage } from "./error.js";

document.addEventListener("DOMContentLoaded", displayBookingForm);

const displayBookingForm = async () => {
    const formContainer = document.getElementById("formData");
    const iternaryContainer = document.getElementById("iternaryContainer");

    if (!formContainer || !iternaryContainer) return;

    try {
        const authResponse = await fetch(`${url}/user/current-user`, {
            method: "GET",
            credentials: "include",
        });

        const authData = await authResponse.json();

        if (!authResponse.ok) {
            showMessage(authData.message || "Unauthorized access", false);
            return;
        }

        const userId = authData.userId || authData.id;

        const iternaryResponse = await fetch(`${url}/user/allIternaries`, {
            method: "GET",
            credentials: "include",
        });
        const iternaryData = await iternaryResponse.json();

        if (!iternaryResponse.ok) {
            showMessage(
                iternaryData.message || "Failed to fetch itineraries",
                false,
            );
            return;
        }

        if (!Array.isArray(iternaryData) || iternaryData.length === 0) {
            showMessage("No Itineraries found!", false);
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const tourId = parseInt(urlParams.get("tourId"), 10);

        const iternaries = iternaryData.filter(
            (tour) => tour.tourId === tourId,
        );
        if (!iternaries || iternaries.length === 0) {
            showMessage("No Itineraries found for this tour!", false);
            return;
        }

        const selectedTour = iternaries[0];

        let tableRows = "";
        iternaries.forEach((it) => {
            tableRows += `
            <tr class='tbody'>
                <td class='data'>${it.dayNumber || ""}</td>
                <td class='data'>${it.destination || ""}</td>
                <td class='data'>${it.description || ""}</td>
            </tr>`;
        });

        iternaryContainer.innerHTML = `
            <h1 class="h1">ITINERARY</h1>
            <table class='table'>
                <thead>
                    <tr class='thead'>
                        <th>Day</th>
                        <th>Destination</th>
                        <th>Activities</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        `;

        formContainer.innerHTML = `
        <h1 class="h1">BOOKING FORM</h1>
        <form id="tourForm">
            <label for="name">Name</label>
            <input type="text" id="name" placeholder="Enter your Name" name="name" required><br><br>

            <label for="email">Email</label>
            <input type="email" id="email" placeholder="Enter your Email" name="email" required><br><br>

            <label for="phone">Phone</label>
            <input type="tel" id="phone" placeholder="10-digit Mobile Number" name="phone" required pattern="[0-9]{10}" maxlength="10"><br><br>

            <input type="hidden" id="userId" name="userId" value="${userId}" required>
            <input type="hidden" id="tourId" name="tourId" value="${selectedTour.tourId}" required>
            <input type="hidden" id="packageName" name="packageName" value="${selectedTour.packageName}" required>
            <input type="hidden" id="region" name="region" value="${selectedTour.tourName}">
            <input type="hidden" id="bdate" name="bdate" required>
        
            <label for="tdate">Travel Date</label>
            <input type="date" id="tdate" name="tdate" min="" max="2030-12-31" required><br><br>
          
            <label for="noOfAdults">Adults</label>
            <input type="number" id="noOfAdults" placeholder="No of Adults" name="noOfAdults" min="1" max="30" required><br><br>

            <label for="noOfChildren">Children</label>
            <input type="number" id="noOfChildren" placeholder="No of Children" name="noOfChildren" min="0" max="30"><br><br>

            <label for="city">City</label>
            <input type="text" id="city" placeholder="City" name="city" required><br><br>

            <label for="state">State</label>
            <input type="text" id="state" placeholder="State" name="state" required><br><br>

            <label for="country">Country</label>
            <input type="text" id="country" placeholder="Country" name="country" required><br><br>

            <input type="submit" value="Submit">
        </form>`;

        const today = new Date().toISOString().split("T")[0];
        const bdate = document.getElementById("bdate");
        const tdate = document.getElementById("tdate");

        bdate.value = today;
        tdate.value = today;
        tdate.min = today;

        const form = document.getElementById("tourForm");
        form.addEventListener("submit", submitForm);
    } catch (e) {
        console.error(e);
        showMessage("Network error..Please try again..", false);
    }
};

async function submitForm(event) {
    event.preventDefault();

    const userId = parseInt(document.getElementById("userId").value.trim(), 10);
    const tourId = parseInt(document.getElementById("tourId").value.trim(), 10);

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const packageName = document.getElementById("packageName").value.trim();
    const region = document.getElementById("region").value.trim();
    const bdate = document.getElementById("bdate").value.trim();
    const tdate = document.getElementById("tdate").value.trim();
    const noOfAdults =
        parseInt(document.getElementById("noOfAdults").value.trim(), 10) || 0;
    const noOfChildren =
        parseInt(document.getElementById("noOfChildren").value.trim(), 10) || 0;
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const country = document.getElementById("country").value.trim();

    const noOfSeats = noOfAdults + noOfChildren;

    const data = {
        userId,
        tourId,
        name,
        email,
        phone,
        packageName,
        region,
        bdate,
        tdate,
        noOfSeats,
        noOfAdults,
        noOfChildren,
        city,
        state,
        country,
    };

    if (
        Object.values(data).some(
            (value) => value === "" || value === null || value === undefined,
        )
    ) {
        showMessage("Please fill all customer details correctly", false);
        return;
    }

    const pkgName = encodeURIComponent(packageName);
    try {
        const response = await fetch(`${url}/user/${pkgName}/book`, {
            method: "POST",
            body: JSON.stringify(data),
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        const responseData = await response.json();

        if (!response.ok) {
            showMessage(responseData.message || "Booking failed", false);
            return;
        }
        showMessage(responseData.message || "Booking successful!", true);
    } catch (err) {
        console.error(err);
        showMessage("Network error..Please try again", false);
    }
}
