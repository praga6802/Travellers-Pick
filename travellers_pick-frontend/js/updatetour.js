import { showFormMessage, showSessionMessage } from "./error.js";
import { url } from "./config.js";

//admin is logged, create update tour container
const tourContainer = document.getElementById("tour-container");
const displayCurrentAdmin = async () => {
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
                window.location.href = "../html/loginform.html";
            }, 1500);
            return;
        }

        tourContainer.innerHTML = `
          	<form id="updatecategoryform" enctype="multipart/form-data">
                <legend>UPDATE TOUR</legend>

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
        </form>`;

        const packageNameSelect = document.getElementById("packageName");

        const pkgResponse = await fetch(`${url}/admin/packageNames`, {
            method: "GET",
            credentials: "include",
        });

        const packageData = await pkgResponse.json();
        if (!pkgResponse.ok) {
            showSessionMessage(packageData.message, false);
            return;
        }

        if (packageData.length === 0) {
            tourContainer.style.display = "none";
            showSessionMessage("No Packages found", false);
            return;
        }

        packageData.forEach((pkg) => {
            const option = document.createElement("option");
            option.value = pkg.packageId;
            option.innerText = pkg.packageName;
            packageId.appendChild(option);
        });

        responseData.forEach((pkg) => {
            const option = document.createElement("option");
            option.value = pkg.packageId;
            option.innerText = pkg.packageName;
            packageNameSelect.appendChild(option);
        });

        const form = document.getElementById("updatecategoryform");
        form.addEventListener("submit", handleUpdate);
    } catch (err) {
        showSessionMessage("Network error..Please try again");
        console.error(err);
    }
};

const handleUpdate = async (event) => {
    event.preventDefault();
    const packageId = document.getElementById("packageName").value.trim();
    const tourIdVal = document.getElementById("tourId").value.trim();

    if (!tourIdVal) {
        showFormMessage("Tour ID not found", false);
        return;
    }

    const tourName = document.getElementById("tourName").value.trim();
    const tourSlogan = document.getElementById("tourSlogan").value.trim();
    const places = document.getElementById("places").value.trim();
    const daysVal = document.getElementById("days").value.trim();
    const nightsVal = document.getElementById("nights").value.trim();
    const priceVal = document.getElementById("price").value.trim();
    const imageFile = document.getElementById("imageFile");

    const data = new FormData();
    data.append("packageId", packageId);
    data.append("tourId", parseInt(tourIdVal));
    if (tourName) data.append("tourName", tourName);
    if (tourSlogan) data.append("tourSlogan", tourSlogan);
    if (places) data.append("places", places);
    if (daysVal) data.append("days", parseInt(daysVal));
    if (nightsVal) data.append("nights", parseInt(nightsVal));
    if (priceVal) data.append("price", parseInt(priceVal));
    if (imageFile.files && imageFile.files.length > 0)
        data.append("imageFile", imageFile.files[0]);

    try {
        const response = await fetch(`${url}/admin/updateCategory`, {
            method: "PUT",
            body: data,
            credentials: "include",
        });

        const responseData = await response.json();
        if (!response.ok) {
            showFormMessage(responseData.message, false);
            return;
        }

        const form = document.getElementById("updatecategoryform");
        const error = document.getElementById("form-error");

        showFormMessage(responseData.message, true);
        setTimeout(() => {
            form.reset();
            error.classList.add(".hide");
        }, 2000);
    } catch (err) {
        showFormMessage("Network error..Please try again");
        console.error(err);
    }
};

document.addEventListener("DOMContentLoaded", displayCurrentAdmin);
