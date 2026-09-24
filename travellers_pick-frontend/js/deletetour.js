import { showFormMessage, showSessionMessage } from "./error.js";
import { url } from "./config.js";
const container = document.getElementById("tourContainer");

const initDeleteTourForm = async () => {
    try {
        const authResponse = await fetch(`${url}/admin/current-admin`, {
            method: "GET",
            credentials: "include",
        });

        const authData = await authResponse.json();

        if (!authResponse.ok) {
            container.style.display = "none";
            showSessionMessage(authData.message, false);
            setTimeout(() => {
                window.location.href = "../html/admin-login.html";
            }, 1500);
            return;
        }

        container.innerHTML = `
            <form id="deletecategoryform">
                <legend>DELETE TOUR</legend>

                <div class="input">
                    <label for="packageId">Package Name</label>
                        <select name="packageId" id="packageId" required>
                            <option value="" hidden selected disabled>Select Package</option>
                        </select>
                </div><br>

                <div class="input">
                    <label for="tourId">Tour Name</label>
                        <select name="tourId" id="tourId" disabled required>
                            <option value="" hidden selected disabled>Select Tour</option>
                        </select>
                </div><br>

                <div class="button-group">
                    <input type="submit" value="DELETE" class="button" />
                    <input type="reset" value="RESET" class="button" />
                </div>
                <p id="form-error"></p>
            </form>
        `;

        await loadPackages();

        const packageSelect = document.getElementById("packageId");
        const form = document.getElementById("deletecategoryform");

        packageSelect.addEventListener("change", handlePackageChange);
        form.addEventListener("submit", deleteTour);
    } catch (err) {
        showSessionMessage("Network error.. Please try again!", false);
        console.error(err);
    }
};

// Fetch Packages
const loadPackages = async () => {
    const packageSelect = document.getElementById("packageId");
    try {
        const response = await fetch(`${url}/admin/packageNames`, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json();
        if (!response.ok) {
            container.style.display = "none";
            showSessionMessage(
                data.message || "Failed to load packages",
                false,
            );
            return;
        }

        if (data.length === 0) {
            container.style.display = "none";
            showSessionMessage("No Tours found for this package!", false);
            return;
        }

        data.forEach((pkg) => {
            const option = document.createElement("option");
            option.value = pkg.packageId;
            option.innerText = pkg.packageName;
            packageSelect.appendChild(option);
        });
    } catch (err) {
        showSessionMessage("Network error..Please try again!", false);
        console.error(err);
    }
};

const handlePackageChange = async (e) => {
    const packageId = e.target.value;
    const tourSelect = document.getElementById("tourId");

    tourSelect.innerHTML = `<option value="" hidden selected disabled>Select Tour</option>`;
    tourSelect.disabled = true;

    if (!packageId) return;

    try {
        const response = await fetch(
            `${url}/admin/toursByPackage?packageId=${packageId}`,
            {
                method: "GET",
                credentials: "include",
            },
        );

        const tours = await response.json();

        if (!response.ok) {
            showSessionMessage("Failed to load tours", false);
            return;
        }

        if (tours.length === 0) {
            showSessionMessage("No tours found for this package", false);
            return;
        }

        tours.forEach((tour) => {
            const option = document.createElement("option");
            option.value = tour.tourId;
            option.innerText = tour.tourName;
            tourSelect.appendChild(option);
        });

        tourSelect.disabled = false;
    } catch (err) {
        showSessionMessage("Network error..Please try again!", false);
        console.error(err);
    }
};

const deleteTour = async (e) => {
    e.preventDefault();
    const deletePackageForm = document.getElementById("deletecategoryform");
    const form_error = document.getElementById("form-error");

    const tourId = document.getElementById("tourId").value;
    const packageId = document.getElementById("packageId").value;

    if (!packageId || !tourId) {
        showFormMessage("Please select both Package Name and Tour Name", false);
        return;
    }

    try {
        const response = await fetch(`${url}/admin/deleteTour`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ packageId, tourId }),
        });

        const data = await response.json();

        if (!response.ok) {
            showFormMessage("Failed to delete tour", false);
            return;
        }

        showFormMessage(data.message, true);

        //resetting the tour from packages
        const tourSelect = document.getElementById("tourId");
        const selectedOption = tourSelect.querySelector(
            `option[value="${tourId}"]`,
        );
        if (selectedOption) selectedOption.remove();
        tourSelect.value = "";

        showFormMessage(data.message, true);
        setTimeout(() => {
            deletePackageForm.reset();
            form_error.classList.add("hide");
        }, 2000);
    } catch (err) {
        showSessionMessage("Network error.. Please try again!", false);
        console.error(err);
    }
};

document.addEventListener("DOMContentLoaded", initDeleteTourForm);
