import { showFormMessage, showSessionMessage } from "./error.js";
import { url } from "./config.js";

const tourContainer = document.getElementById("tour-container");
const displayAddTourForm = async () => {
    try {
        const authResponse = await fetch(`${url}/admin/current-admin`, {
            method: "GET",
            credentials: "include",
        });

        const authData = await authResponse.json();

        if (!authResponse.ok) {
            tourContainer.style.display = "none";

            showSessionMessage(authData.message, false);
            setTimeout(() => {
                window.location.href = "../html/admin-login.html";
            }, 2000);
            return;
        }

        tourContainer.innerHTML = `
        	<form id="addcategoryform" enctype="multipart/form-data">
                <legend>ADD TOUR</legend>

                <div class="input-list">
                    <div class="input">
                        <label for="packageName">Package Name</label>
                            <select name="packageName" id="packageName" required>
                                <option disabled selected hidden value="">Select Package</option>
                            </select>
                    </div>

                    <div class="input">
                        <label for="tourName">Tour Name</label>
                        <input
                            type="text"
                            name="tourName"
                            id="tourName"
                            placeholder="Enter the tour name"
                            required>
                    </div>

                    <div class="input">
                        <label for="tourSlogan">Tour Slogan</label>
                        <input
                            type="text"
                            name="tourSlogan"
                            id="tourSlogan"
                            maxlength="50"
                            placeholder="Enter the tour slogan">
                    </div>

                    <div class="input">
                        <label for="places">Places</label>
                        <input
                            type="text"
                            name="places"
                            id="places"
                            placeholder="Enter the list of places separated by comma"
                            required>
                    </div>


                    <div id="duration">
                        <div class="input">
                            <label for="days">Days</label>
                            <input
                                type="number"
                                name="days"
                                id="days"
                                placeholder="0"
                                max="10"
                                min="1"
                                required>
                        </div>

                        <div class="input">
                            <label for="nights">Nights</label>
                            <input
                                type="number"
                                name="nights"
                                id="nights"
                                placeholder="0"
                                max="10"
                                min="1"
                                required>
                        </div>
                    </div>

                    <div class="input">
                        <label for="price">Price</label>
                        <input
                            type="text"
                            name="price"
                            id="price"
                            placeholder="Enter amount"
                            required>
                    </div>

                    <div class="input">
                        <label for="imageFile">Tour Image</label>
                        <input
                            type="file"
                            name="imageFile"
                            id="imageFile"
                            accept="image/*">
                    </div>

                    <div class="button-group">
                        <input type="submit" value="ADD" name="submit" class="button" />
                        <input type="reset" value="RESET" name="reset" class="button" />
                    </div>
                </div>
                <p id="form-error"></p>
        </form>
        `;

        const packageNameSelect = document.getElementById("packageName");
        if (!packageNameSelect) return;

        const response = await fetch(`${url}/admin/packageNames`, {
            method: "GET",
            credentials: "include",
        });

        const responseData = await response.json();

        if (!response.ok) {
            tourContainer.style.display = "none";
            showSessionMessage("Failed to load packages", false);
            return;
        }

        if (responseData.length === 0) {
            tourContainer.style.display = "none";
            showSessionMessage("No packages available", false);
            return;
        }

        packageNameSelect.innerHTML = `<option value="" hidden selected disabled>Select Package</option>`;
        responseData.forEach((pkg) => {
            const option = document.createElement("option");
            option.value = pkg.packageId;
            option.textContent = pkg.packageName;
            packageNameSelect.appendChild(option);
        });

        const tourForm = document.getElementById("addcategoryform");
        tourForm.addEventListener("submit", handleAddCategory);
    } catch (err) {
        showSessionMessage("Network error. Please try again.", false);
        console.error(err);
    }
};

async function handleAddCategory(event) {
    event.preventDefault();

    const packageIdInput = document.getElementById("packageName").value.trim();
    const packageId = parseInt(packageIdInput, 10);
    const tourName = document.getElementById("tourName").value.trim();
    const tourSlogan = document.getElementById("tourSlogan").value.trim();
    const places = document.getElementById("places").value.trim();
    const days = parseInt(document.getElementById("days").value.trim(), 10);
    const nights = parseInt(document.getElementById("nights").value.trim(), 10);
    const price = parseFloat(document.getElementById("price").value.trim());
    const imageFileInput = document.getElementById("imageFile");

    if (
        isNaN(packageId) ||
        !tourName ||
        !tourSlogan ||
        !places ||
        isNaN(days) ||
        days < 0 ||
        isNaN(nights) ||
        nights < 0 ||
        isNaN(price) ||
        price <= 0
    ) {
        showFormMessage("Please fill all fields with valid information", false);
        return;
    }

    if (!imageFileInput.files || imageFileInput.files.length === 0) {
        showFormMessage("Image file is required", false);
        return;
    }

    const data = new FormData();
    data.append("packageId", packageId);
    data.append("tourName", tourName);
    data.append("tourSlogan", tourSlogan);
    data.append("places", places);
    data.append("days", days);
    data.append("nights", nights);
    data.append("price", price);
    data.append("imageFile", imageFileInput.files[0]);

    try {
        const response = await fetch(`${url}/admin/addTour`, {
            method: "POST",
            credentials: "include",
            body: data,
        });

        const responseData = await response.json();

        if (!response.ok) {
            showFormMessage("Failed to add tour", false);
            return;
        }
        const form = document.getElementById("addcategoryform");
        const error = document.getElementById("form-error");

        showFormMessage(responseData.message, true);
        setTimeout(() => {
            form.reset();
            error.classList.add(".hide");
        }, 2000);
    } catch (err) {
        showSessionMessage("Network error..Unable to with the server!", false);
        console.error(err);
    }
}

document.addEventListener("DOMContentLoaded", displayAddTourForm);
