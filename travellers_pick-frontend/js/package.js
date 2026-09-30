import { showFormMessage, showSessionMessage } from "./error.js";
import { url, uiUrl } from "./config.js";
const packageContainer = document.getElementById("packageContainer");
const displayPackage = async () => {
    try {
        const authResponse = await fetch(`${url}/user/current-user`, {
            method: "GET",
            credentials: "include",
        });
        const authData = await authResponse.json();

        if (!authResponse.ok) {
            packageContainer.style.display = "none";
            showSessionMessage(authData.message, false);
            setTimeout(() => {
                window.location.href = "../html/user-login.html";
            }, 1500);
            return;
        }

        const response = await fetch(`${url}/admin/allPackages`, {
            method: "GET",
            credentials: "include",
        });

        const responseData = await response.json();

        if (!response.ok) {
            packageContainer.style.display = "none";
            showSessionMessage("Unable to load packages", false);
            return;
        }

        if (responseData.length === 0) {
            packageContainer.style.display = "none";
            showSessionMessage("No Packages found!", false);
        }

        packageContainer.innerHTML = `
        	<h1 class="heading">POPULAR PACKAGES</h1>
        `;

        responseData.forEach((pkg) => {
            const col = document.createElement("div");
            col.className = "col-12 col-md-4";
            col.innerHTML = `
                <div class="card">
                    <img src='${url}${pkg.imgUrl}' alt='${pkg.packageName}'>
                    <h2 class="package-title">${pkg.packageName}</h2>
                    <h6 class="package-slogan"> -${pkg.packageSlogan}- </h6>
                    <button class='explore-button'>EXPLORE</button>
                </div>
            `;

            const exploreButton = col.querySelector(".explore-button");
            exploreButton.addEventListener("click", () => {
                bookPackage(pkg.fileName, pkg.packageId);
            });
            packageContainer.appendChild(col);
        });
    } catch (e) {
        showSessionMessage(e.message, false);
        console.error(e);
    }
};

function bookPackage(fileName, packageId) {
    window.location.href = `${uiUrl}/html/${fileName}?packageId=${packageId}`;
}

document.addEventListener("DOMContentLoaded", displayPackage);
