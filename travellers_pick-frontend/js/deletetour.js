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
                    <label for="package-select">Package Name</label>
                        <select name="packageId" id="package-select" required>
                            <option value="" hidden selected disabled>Select Package</option>
                        </select>
                </div><br>

                <div class="input">
                    <label for="tour-select">Tour Name</label>
                        <select name="tourId" id="tour-select" disabled required>
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

        const packageNameSelect = document.getElementById("package-select");
        const tourSelect = document.getElementById("tour-select");

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
            packageNameSelect.appendChild(option);
        });

        packageNameSelect.addEventListener("change", async () => {
            const packageId = packageNameSelect.value;

            try {
                const tourResponse = await fetch(
                    `${url}/admin/tourNames/${packageId}`,
                    { method: "GET", credentials: "include" },
                );

                const tourResponseData = await tourResponse.json();

                if (!tourResponse.ok) {
                    showFormMessage("Fetch to load tours!", false);
                    return;
                }

                if (!tourResponseData || tourResponseData.length === 0) {
                    showFormMessage("No tours found!");
                    return;
                }

                tourResponseData.forEach((tour) => {
                    const option = document.createElement("option");
                    option.textContent = tour.tourName;
                    option.value = tour.tourId;

                    tourSelect.appendChild(option);
                });
            } catch (err) {
                console.error(err);
                showFormMessage("Failed to load tours!", false);
            }
        });
    } catch (err) {
        showSessionMessage("Network error.. Please try again!", false);
        console.error(err);
    }
};

// delete tour
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

        //resetting the tour from packages
        const tourSelect = document.getElementById("tour-select");
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
