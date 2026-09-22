import { showMessage } from "./error.js";

//get the current admin

const displayUpdatePackageForm = async () => {
    try {
        const authResponse = await fetch(`${url}/admin/current-admin`, {
            method: "GET",
            credentials: "include",
        });

        const authData = await authResponse.json();

        if (!authResponse.ok) {
            showMessage(authData.message, false);
            setTimeout(() => {
                window.location.href = "../html/loginform.html";
            }, 1500);
            return;
        }

        // if admin logged, then create delete container
        const packageContainer = document.getElementById("package-container");
        packageContainer.innerHTML = `
            <form id="deletepackageform">
                <legend>DELETE PACKAGE</legend>

                <div class="input-box">
                    <label>Choose Package ID</label>
                    <span>
                        <select name="packageId" id="packageId">
                            <option value="" hidden selected disabled>Select Package</option>
                        </select>
                    </span>
                </div>
                <div class="button-group">
                    <input type="submit" value="DELETE" name="submit" class="button" />
                    <input type="reset" value="RESET" name="reset" class="button" />
                </div>
            </form>
        `;

        const packageSelect = document.getElementById("packageId");
        const response = await fetch(`${url}/admin/packageNames`, {
            method: "GET",
            credentials: "include",
        });

        const responseData = await response.json();
        if (!response.ok) {
            showMessage(responseData.message, false);
            return;
        }

        if (!responseData) {
            showMessage("No packages found!", false);
            return;
        }

        responseData.forEach((pkg) => {
            const option = document.createElement("option");
            option.value = pkg.packageId;
            option.innerText = pkg.packageName;
            packageSelect.appendChild(option);
        });

        const packageform = document.getElementById("deletepackageform");
        packageform.addEventListener("submit", deletePackage);
    } catch (err) {
        showMessage("Network error..Please try again!");
        console.error(err);
    }
};

const deletePackage = async (e) => {
    e.preventDefault();

    const packageSelect = document.getElementById("packageId");
    const packageId = packageSelect ? packageSelect.value : "";

    if (!packageId) {
        showMessage("Please select Package Name to delete");
        return;
    }

    try {
        const response = await fetch(`${url}/admin/deletePackage`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ packageId }),
        });

        const responseData = await response.json();
        if (!response.ok) {
            showMessage(responseData.message, false);
            return;
        }

        showMessage(responseData.message, true);

        const selectedOption = packageSelect.querySelector(
            `option[value="${packageId}"]`,
        );
        if (selectedOption) {
            selectedOption.remove();
        }

        document.getElementById("deletepackageform").reset();
    } catch (err) {
        showMessage("Network error..Please try again!");
        console.error(err);
    }
};

document.addEventListener("DOMContentLoaded", displayUpdatePackageForm);
