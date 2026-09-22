import { showMessage } from "./error.js";

const initAddCategoryForm = async () => {
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

        const packageNameSelect = document.getElementById("packageName");
        if (!packageNameSelect) return;

        const response = await fetch(`${url}/admin/packageNames`, {
            method: "GET",
            credentials: "include",
        });

        const responseData = await response.json();

        if (!response.ok) {
            showMessage(
                responseData.message || "Failed to load packages",
                false,
            );
            return;
        }

        if (Array.isArray(responseData) && responseData.length === 0) {
            showMessage("No packages available", false);
            return;
        }

        packageNameSelect.innerHTML = `<option value="" hidden selected disabled>Select Package</option>`;
        responseData.forEach((pkg) => {
            const option = document.createElement("option");
            option.value = pkg.packageId;
            option.textContent = pkg.packageName;
            packageNameSelect.appendChild(option);
        });
    } catch (err) {
        showMessage("Network error. Please try again.", false);
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
        showMessage("Please fill all fields with valid information", false);
        return;
    }

    if (!imageFileInput.files || imageFileInput.files.length === 0) {
        showMessage("Image file is required", false);
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
        const response = await fetch(`${url}/admin/addCategory`, {
            method: "POST",
            credentials: "include",
            body: data,
        });

        const responseData = await response.json();

        if (!response.ok) {
            showMessage(responseData.message || "Failed to add tour", false);
            return;
        }

        showMessage(responseData.message || "Tour added successfully!", true);
        document.getElementById("addcategoryform").reset();
    } catch (err) {
        showMessage("Network error. Could not connect to server.", false);
        console.error(err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initAddCategoryForm();

    const form = document.getElementById("addcategoryform");
    if (form) {
        form.addEventListener("submit", handleAddCategory);
        form.addEventListener("reset", () => {
            showMessage("", true);
        });
    }
});
