import { showMessage } from "./error.js";
import { url } from "./config.js";
const initDeleteTourForm = async () => {
    try {
        const authResponse = await fetch(`${url}/admin/current-admin`, {
            method: "GET",
            credentials: "include",
        });

        const authData = await authResponse.json();

        if (!authResponse.ok) {
            showMessage(authData.message || "Unauthorized access", false);
            setTimeout(() => {
                window.location.href = "../html/loginform.html";
            }, 1500);
            return;
        }

        const container = document.getElementById("package-container");
        container.innerHTML = `
            <form id="deletecategoryform">
                <legend>DELETE TOUR</legend>

                <div class="input-box">
                    <label for="packageId">Package Name</label>
                    <span>
                        <select name="packageId" id="packageId" required>
                            <option value="" hidden selected disabled>Select Package</option>
                        </select>
                    </span>
                </div><br>

                <div class="input-box">
                    <label for="tourId">Tour Name</label>
                    <span>
                        <select name="tourId" id="tourId" disabled required>
                            <option value="" hidden selected disabled>Select Tour</option>
                        </select>
                    </span>
                </div><br>

                <div class="button-group">
                    <input type="submit" value="DELETE" name="submit" class="button" />
                    <input type="reset" value="RESET" name="reset" class="button" />
                </div>
            </form>
        `;

        await loadPackages();

        const packageSelect = document.getElementById("packageId");
        const form = document.getElementById("deletecategoryform");

        packageSelect.addEventListener("change", handlePackageChange);
        form.addEventListener("submit", deleteTour);
        form.addEventListener("reset", handleReset);
    } catch (err) {
        showMessage("Network error.. Please try again!", false);
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
            showMessage(data.message || "Failed to load packages", false);
            return;
        }

        data.forEach((pkg) => {
            const option = document.createElement("option");
            option.value = pkg.packageId;
            option.innerText = pkg.packageName;
            packageSelect.appendChild(option);
        });
    } catch (err) {
        showMessage("Failed to load packages", false);
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
            showMessage(tours.message || "Failed to load tours", false);
            return;
        }

        if (tours.length === 0) {
            showMessage("No tours found for this package", false);
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
        showMessage("Failed to load tours", false);
        console.error(err);
    }
};

const deleteTour = async (e) => {
    e.preventDefault();

    const tourId = document.getElementById("tourId").value;
    const packageId = document.getElementById("packageId").value;

    if (!packageId || !tourId) {
        showMessage("Please select both Package Name and Tour Name", false);
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
            showMessage(data.message || "Failed to delete tour", false);
            return;
        }

        showMessage(data.message || "Tour deleted successfully!", true);

        const tourSelect = document.getElementById("tourId");
        const selectedOption = tourSelect.querySelector(
            `option[value="${tourId}"]`,
        );
        if (selectedOption) selectedOption.remove();

        tourSelect.value = "";
    } catch (err) {
        showMessage("Network error.. Please try again!", false);
        console.error(err);
    }
};

const handleReset = () => {
    const tourSelect = document.getElementById("tourId");
    tourSelect.innerHTML = `<option value="" hidden selected disabled>Select Tour</option>`;
    tourSelect.disabled = true;
};

document.addEventListener("DOMContentLoaded", initDeleteTourForm);
