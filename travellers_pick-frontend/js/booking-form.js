import { showFormMessage, showSessionMessage } from "./error.js";
import { url } from "./config.js";

const formContainer = document.getElementById("formData");
const iternaryContainer = document.getElementById("iternaryContainer");

const displayBookingForm = async () => {
    try {
        const authResponse = await fetch(`${url}/user/current-user`, {
            method: "GET",
            credentials: "include",
        });

        const authData = await authResponse.json();
        console.log(authData,authData.userId);
        

        if (!authResponse.ok) {
            formContainer.style.display = "none";
            iternaryContainer.style.display = "none";

            showSessionMessage(authData.message, false);
            setTimeout(() => {
                window.location.href = "../html/user-login.html";
            }, 1500);
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const tourId = parseInt(urlParams.get("tourId"), 10);
        console.log(tourId);

        // get itineraries by tourID
        const iternaryResponse = await fetch(
            `${url}/user/itineraries/${tourId}`,
            {
                method: "GET",
                credentials: "include",
            },
        );

        const iternaryResponseData = await iternaryResponse.json();

        if (!iternaryResponse.ok) {
            showSessionMessage("Failed to fetch itineraries", false);
            return;
        }

        if (iternaryResponseData.length === 0) {
            showSessionMessage("No Itineraries found for this tour!", false);
            return;
        }

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
                <tbody id="table-row">
                </tbody>
            </table>
        `;

        const tableRows = document.getElementById("table-row");
        iternaryResponseData.forEach((it) => {
            tableRows.innerHTML += `
            <tr class='tbody'>
                <td class='data'>${it.day || ""}</td>
                <td class='data'>${it.destination || ""}</td>
                <td class='data'>${it.description || ""}</td>
            </tr>`;
        });

        const tourResponse = await fetch(`${url}/user/tour/${tourId}`, {
            method: "GET",
            credentials: "include",
        });

        const selectedTour = await tourResponse.json();

        if (!tourResponse.ok) {
            showSessionMessage("Failed to fetch tour details", false);
            return;
        }

        if (!selectedTour) {
            showSessionMessage("Failed to fetch tour details", false);
            return;
        }

        formContainer.innerHTML = `
        <h1 class="h1">BOOKING FORM</h1>
        <form id="tourForm">
            <label for="name">Name</label>
            <input type="text" id="name" placeholder="Enter your Name" name="name" required><br><br>

            <label for="email">Email</label>
            <input type="email" id="email" placeholder="Enter your Email" name="email" required><br><br>

            <label for="phone">Phone</label>
            <input type="tel" id="phone" placeholder="10-digit Mobile Number" name="phone" required pattern="[0-9]{10}" maxlength="10"><br><br>

            <input type="hidden" id="userId" name="userId" value="${authData.userId}" required>
            <input type="hidden" id="tourId" name="tourId" value="${tourId}" required>

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

            <p id="form-error"></p>
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
        showSessionMessage("Network error..Please try again..", false);
    }
};

async function submitForm(event) {
    event.preventDefault();

    console.log("submitted form");

    const tourform = event.target;
    const form_error = document.getElementById("form-error");

    const userId = parseInt(document.getElementById("userId").value.trim(), 10);
    const tourId = parseInt(document.getElementById("tourId").value.trim(), 10);

    console.log(userId, tourId);

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

    try {
        const response = await fetch(`${url}/user/bookTour`, {
            method: "POST",
            body: JSON.stringify(data),
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        const responseData = await response.json();

        if (!response.ok) {
            showFormMessage(responseData.message, false);
            return;
        }

        showFormMessage(responseData.message, true);

        setTimeout(() => {
            form_error.classList.add("hide");
            tourform.reset();
        }, 2000);
    } catch (err) {
        console.error(err);
        showSessionMessage("Network error..Please try again", false);
    }
}
document.addEventListener("DOMContentLoaded", displayBookingForm);
