import { showFormMessage, showSessionMessage } from "./error.js";
import { url } from "./config.js";

const packageContainer = document.getElementById("package-container");
const displayForm = async () => {
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
                window.location.href = "../html/admin-login.html";
            }, 2000);
            return;
        }

        packageContainer.innerHTML = `
        		<form id="packageform" enctype="multipart/form-data">
                <legend>ADD PACKAGE</legend>

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
                    <input type="submit" value="ADD" class="button" />
                    <input type="reset" value="RESET" class="button" />
                </div>
                <p id="form-error"></p>
		</form>
        `;

        const addpackageform = document.getElementById("packageform");
        addpackageform.addEventListener("submit", handlePackage);
    } catch (err) {
        showSessionMessage("Network error..Please try again");
        console.error(err);
    }
};

const handlePackage = async (e) => {
    e.preventDefault();

    const addPackageForm = document.getElementById("packageform");
    const formMessage = document.getElementById("form-error");

    const packageName = document.getElementById("packageName").value.trim();
    const packageSlogan = document.getElementById("packageSlogan").value.trim();
    const imageFile = document.getElementById("imageFile");

    if (!packageName) {
        showFormMessage("Package name is required!", false);
        return;
    }
    if (!packageSlogan) {
        showFormMessage("Package Slogan is required!", false);
        return;
    }

    if (!imageFile.files || imageFile.files.length === 0) {
        showFormMessage("Image is required!", false);
        return;
    }

    const formData = new FormData();
    formData.append("packageName", packageName);
    formData.append("packageSlogan", packageSlogan);
    formData.append("imageFile", imageFile.files[0]);

    try {
        const response = await fetch(`${url}/admin/addPackage`, {
            method: "POST",
            body: formData,
            credentials: "include",
        });
        const responseData = await response.json();
        if (!response.ok) {
            showFormMessage(responseData.message, false);
            return;
        }

        showFormMessage(responseData.message, true);
        
        setTimeout(() => {
            addPackageForm.reset();
            formMessage.style.display = "none";
        }, 2000);
    } catch (err) {
        showFormMessage("Network error..Please try again!");
        console.log(err);
    }
};

document.addEventListener("DOMContentLoaded", displayForm);
