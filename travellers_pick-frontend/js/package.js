import { showFormMessage, showSessionMessage } from "./error.js";
import { url } from "./config.js";
const displayPackage = async () => {
    try {
        const response = await fetch(`${url}/admin/allPackages`, {
            method: "GET",
            credentials: "include",
        });

        const responseData = await response.json();

        if (!response.ok) {
            showSessionMessage("Unable to load packages", false);
            return;
        }

        if (responseData.length === 0) {
            showSessionMessage("No Packages found!", false);
        }

        const packageContainer = document.getElementById("packageContainer");
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
                <button class='explore-button' onclick="bookPackage('${pkg.fileName}','${pkg.packageId}')">EXPLORE</button>
            `;
            packageContainer.appendChild(card);
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
