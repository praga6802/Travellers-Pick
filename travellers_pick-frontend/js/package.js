import { showFormMessage, showSessionMessage } from "./error.js";
import { url } from "./config.js";
const packageContainer = document.getElementById("packageContainer");
const displayPackage = async () => {
    try {
        const authResponse = await fetch(`${url}/admin/current-user`, {
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
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <img src='${url}${pkg.imgUrl}' alt='${pkg.packageName}'>
                <h2 class="package-title">${pkg.packageName}</h2>
                <h6 class="package-slogan"> -${pkg.packageSlogan}- </h6>
                <button class='explore-button'>EXPLORE</button>
            `;
            packageContainer.appendChild(card);

            const exploreButton = document.querySelector(".explore-button");
            exploreButton.addEventListener("click", () => {
                bookPackage(pkg.fileName, pkg.packageId);
            });
        });
    } catch (e) {
        showMessage(e.message, false);
        console.error(e);
    }
};

function bookPackage(fileName, packageId) {
    window.location.href = `${url}/html/${fileName}?packageId=${packageId}`;
}

document.addEventListener("DOMContentLoaded", displayPackage);
