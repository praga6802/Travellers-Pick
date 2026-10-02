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
        console.log(authData, authData.userId);

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
        const packageId = parseInt(urlParams.get("packageId"), 10);
        const tourId = parseInt(urlParams.get("tourId"), 10);

        // get itineraries for with packageId and tourId
        const iternaryResponse = await fetch(
            `${url}/admin/packages/${packageId}/tours/${tourId}/itineraries`,
            {
                method: "GET",
                credentials: "include",
            },
        );

        const iternaryResponseData = await iternaryResponse.json();

        if (!iternaryResponse.ok) {
            iternaryContainer.style.display = "none";
            formContainer.style.display = "none";
            showSessionMessage("Failed to fetch itineraries", false);
            return;
        }

        if (!iternaryResponseData || iternaryResponseData.length === 0) {
            iternaryContainer.style.display = "none";
            formContainer.style.display = "none";
            showSessionMessage("No Itineraries found!", false);
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
        iternaryResponseData.data.forEach((it) => {
            tableRows.innerHTML += `
            <tr class='tbody'>
                <td class='data'>${it.day || ""}</td>
                <td class='data'>${it.destination || ""}</td>
                <td class='data'>${it.description || ""}</td>
            </tr>`;
        });

        // fetch package details by package id
        const packageResponse = await fetch(
            `${url}/admin/packages/${packageId}`,
            {
                method: "GET",
                credentials: "include",
            },
        );

        // fetch tour details by tour id
        const tourResponse = await fetch(
            `${url}/admin/packages/${packageId}/tours/${tourId}`,
            {
                method: "GET",
                credentials: "include",
            },
        );

        const packageResponseData = await packageResponse.json();

        const tourResponseData = await tourResponse.json();

        if (!packageResponse.ok) {
            console.error("Failed to fetch package details", false);
            return;
        }

        if (!packageResponseData) {
            console.error("No Packages found", false);
            return;
        }

        if (!tourResponse.ok) {
            console.error("Failed to fetch tour details", false);
            return;
        }

        if (!tourResponseData) {
            console.error("No Tour found", false);
            return;
        }

        const today = new Date().toISOString().split("T")[0];
        formContainer.innerHTML = `
        <h1 class="h1">BOOKING FORM</h1>
         <div class="container">
            <div class="row justify-content-center">
                <div class="col-12">
                <form id="tourForm">

                <div class="input-field">
                <label for="name">Name</label>
                <input type="text" id="name" placeholder="Enter your Name" name="name" required>
                </div>

                <div class="input-field">
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="Enter your Email" name="email" required>
                </div>

                <div class="input-field">
                <label for="phone">Phone</label>
                <input type="tel" id="phone" placeholder="10-digit Mobile Number" name="phone" required
                    pattern="[0-9]{10}" maxlength="10">
                </div>

                <div class="input-field">
                <input type="hidden" id="userId" name="userId" value="${authData.data.userId}">
                </div>

                <div class="input-field">
                <input type="hidden" id="tourId" name="tourId" value="${tourId}">
                </div>

                <div class="input-field">
                <input type="hidden" id="packageName" name="packageName" value="${packageResponseData.data.packageName}">
                </div>

                <div class="input-field">
                <input type="hidden" id="region" name="region" value="${tourResponseData.data.tourName}">
                </div>

                <div class="input-field">
                <label for="bdate">Booking Date</label>
                <input type="hidden" id="bdate" name="bdate" value="${today}" required>
                </div>

                <div class="input-field">
                <label for="tdate">Travel Date</label>
                <input type="date" id="tdate" name="tdate" min="${today}" max="2030-12-31" required>
                </div>

                <div class="input-field">
                <label for="noOfAdults">Adults</label>
                <input type="number" id="noOfAdults" placeholder="No of Adults" name="noOfAdults" min="1" max="30"
                    required>
                </div>

                <div class="input-field">
                <label for="noOfChildren">Children</label>
                <input type="number" id="noOfChildren" placeholder="No of Children" name="noOfChildren" min="0" max="30">
                </div>

                <div class="input-field">
                <label for="city">City</label>
                <input type="text" id="city" placeholder="City" name="city" required>
                </div>

                <div class="input-field">
                <label for="state">State</label>
                <input type="text" id="state" placeholder="State" name="state" required>
                </div>

                <div class="input-field">
                <label for="country">Country</label>
                <input type="text" id="country" placeholder="Country" name="country" required>
                </div>

                <div class="input-field">
                <input type="submit" value="Submit">
                </div>

                <p id="form-error"></p>

          </form>
        </div>
      </div>
    </div>
`;

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
    console.log(bdate, tdate);

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
        const response = await fetch(`${url}/user/book`, {
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
        console.log(responseData.message);
        showFormMessage(responseData.message, true);

        setTimeout(() => {
            tourform.reset();
            form_error.classList.add("hide");
        }, 2000);
    } catch (err) {
        console.error(err);
        showSessionMessage("Network error..Please try again", false);
    }
}
document.addEventListener("DOMContentLoaded", displayBookingForm);
