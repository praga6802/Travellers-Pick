import { showFormMessage, showSessionMessage } from "./error.js";
import { url } from "./config.js";

//if current admin logged in create update package form
const packageContainer = document.getElementById("package-container");
const displayCurrentAdmin = async () => {
    try {
        const authResponse = await fetch(`${url}/admin/current-admin`, {
            method: "GET",
            credentials: "include",
        });
        const authData = await authResponse.json();

        if (!authResponse.ok) {
            packageContainer.style.display = "none";
            showSessionMessage(authData.message, false);
            setTimeout(() => {
                window.location.href = "../html/loginform.html";
            }, 1500);
            return;
        }

        packageContainer.innerHTML = `
            <form id="packageform" enctype="multipart/form-data">
		    <legend>UPDATE PACKAGE</legend>

            <div class="input-box">
                <label>Choose Package ID</label>
                <span>
                    <select name="packageId" id="packageId">
                        <option value="" hidden selected disabled>Select Package</option>
                    </select>
                </span>
            </div><br>

            <div class="input-box">
                <label for="package_name">Package Name</label><br>
                <input type="text" name="packageName" id="packageName" required maxlength="30"
                    placeholder="Package Name" /><br><br>
            </div>
            <div class="input-box">
                <label for="slogan">Package Slogan</label><br>
                <input type="text" name="packageSlogan" id="packageSlogan" maxlength="50"
                    placeholder="Package Slogan" /><br><br>
            </div>

            <div class="input-box">
                <label for="imageFile">Package Image</label><br>
                <input type="file" name="imageFile" id="imageFile" accept="image/*"><br><br>
            </div>
            <div class="button-group">
                <input type="submit" value="UPDATE" class="button" />
                <input type="reset" value="RESET" class="button" />
            </div>
        </form>
        `;

        const packageSelect = document.getElementById("packageId");
        const pkgResponse = await fetch(`${url}/admin/packageNames`, {
            method: "GET",
            credentials: "include",
        });

        const packageData = await pkgResponse.json();

        if (!pkgResponse.ok) {
            packageContainer.style.display = "none";
            showFormMessage(packageData.message, false);
            return;
        }

        if (packageData.length === 0) {
            packageContainer.style.display = "none";
            showSessionMessage("No packages found!", false);
            return;
        }

        packageData.forEach((pkg) => {
            const option = document.createElement("option");
            option.value = pkg.packageId;
            option.innerText = pkg.packageName;
            packageSelect.appendChild(option);
        });

        const updateform = document.getElementById("packageform");
        updateform.addEventListener("submit", handleUpdate);
    } catch (err) {
        showSessionMessage("Network error..Please try again");
        console.error(err);
    }
};

const handleUpdate = async (e) => {
    e.preventDefault();

    const updatePackageForm = e.currentTarget;
    const packageName = document.getElementById("packageName").value.trim();
    const packageSlogan = document.getElementById("packageSlogan").value.trim();
    const packageId = document.getElementById("packageId").value.trim();
    const imageFile = document.getElementById("imageFile");

    if (!packageId) {
        showFormMessage("Package Id not found!");
        return;
    }

    const data = new FormData();
    data.append("packageId", packageId);
    if (packageName) data.append("packageName", packageName);
    if (packageSlogan) data.append("packageSlogan", packageSlogan);
    if (imageFile.files && imageFile.files.length > 0)
        data.append("imageFile", imageFile.files[0]);

    try {
        const response = await fetch(`${url}/admin/updatePackage`, {
            method: "PUT",
            body: data,
            credentials: "include",
        });

        const responseData = await response.json();

        if (!response.ok) {
            showFormMessage(responseData.message, false);
            return;
        }
        showFormMessage(responseData.message, true);
        setTimeout(() => {
            updatePackageForm.reset();
            showFormMessage.style.display = "none";
        }, 2000);
    } catch (err) {
        showFormMessage("Network error..Please try again");
        console.error(err);
    }
};

document.addEventListener("DOMContentLoaded", displayCurrentAdmin);
