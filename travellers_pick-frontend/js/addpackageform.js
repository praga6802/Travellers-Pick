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
		<div class="container">
			<div class="row justify-content-center">
				<div class="col-12 col-md-8 col-lg-6">
					<form id="packageform" enctype="multipart/form-data">
						<legend>ADD PACKAGE</legend>

						<div class="input-box">
							<label for="package_name">Package Name</label><br>
							<input type="text" name="packageName" id="packageName" required maxlength="30"
								placeholder="Package Name" /><br><br>
						</div>
						<div class="input-box">
							<label for="slogan">Package Slogan</label><br>
							<input type="text" name="packageSlogan" id="packageSlogan" required maxlength="50"
								placeholder="Package Slogan" /><br><br>
						</div>
						<div class="input-box">
							<label for="imageFile">Package Image</label><br>
							<input type="file" name="imageFile" id="imageFile" required accept="image/*"><br><br>
						</div>
						<div class="button-group">
							<input type="submit" value="ADD" class="button" />
							<input type="reset" value="RESET" class="button" />
						</div>
						<p id="form-error"></p>
					</form>
				</div>
			</div>
		</div>
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

    const formData = new FormData();
    formData.append("packageName", packageName);
    formData.append("packageSlogan", packageSlogan);
    formData.append("imageFile", imageFile.files[0]);

    try {
        const response = await fetch(`${url}/admin/packages`, {
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
            formMessage.classList.add("hide");
        }, 2000);
    } catch (err) {
        showFormMessage("Network error..Please try again!");
        console.log(err);
    }
};

document.addEventListener("DOMContentLoaded", displayForm);
