import { showMessage } from "./error.js";

const displayForm = async () => {
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

        const packageContainer = document.getElementById("package-container");
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
                    <label for="code">Package Code</label><br>
                    <input type="text" name="packageCode" id="packageCode" maxlength="3"
                        placeholder="Package Code" /><br><br>
                </div>
                <div class="input-box">
                    <label for="imageFile">Package Image</label><br>
                    <input type="file" name="imageFile" id="imageFile" accept="image/*"><br><br>
                </div>
                <div class="button-group">
                    <input type="submit" value="ADD" name="submit" class="button" />
                    <input type="reset" value="RESET" name="reset" class="button" />
                </div>
		</form>
        `;

        const addpackageform = document.getElementById("packageform");
        addpackageform.addEventListener("submit", handlePackage);
    } catch (err) {
        showMessage("Network error..Please try again");
        console.error(err);
    }
};

const handlePackage = async (e) => {
    e.preventDefault();
    const packageName = document.getElementById("packageName").value.trim();
    const packageSlogan = document.getElementById("packageSlogan").value.trim();
    const imageFile = document.getElementById("imageFile");
    const packageCode = document.getElementById("packageCode").value.trim();

    if (!packageName) {
        showMessage("Package name is required!", false);
        return;
    }
    if (!packageSlogan) {
        showMessage("Package Slogan is required!", false);
        return;
    }
    if (!packageCode) {
        showMessage("Package Code is required!", false);
        return;
    }
    if (!imageFile.files || imageFile.files.length === 0) {
        showMessage("Image is required!", false);
        return;
    }

    const formData = new FormData();
    formData.append("packageName", packageName);
    formData.append("packageSlogan", packageSlogan);
    formData.append("packageCode", packageCode);
    formData.append("imageFile", imageFile.files[0]);

    try {
        const response = await fetch(`${url}/admin/addPackage`, {
            method: "POST",
            body: formData,
            credentials: "include",
        });
        const responseData = await response.json();
        if (!response.ok) {
            showMessage(responseData.message, false);
            return;
        }

        showMessage(responseData.message, true);
        document.getElementById("packageform").reset();
    } catch (err) {
        showMessage("Network error..Please try again!");
        console.log(err);
    }
};

document.addEventListener("DOMContentLoaded", displayForm);
