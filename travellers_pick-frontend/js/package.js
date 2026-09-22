import { showMessage } from "./error.js";

const displayPackage = async () => {
    try {
        // const authResponse = await fetch(`${url}/user/current-user`, {
        //     method: "GET",
        // });

        // const authData = await authResponse.json();

        // if (!authResponse.ok) {
        //     showMessage(authData.message, false);
        //     return;
        // }

        const response = await fetch(`${url}/admin/allPackages`, {
            method: "GET",
            credentials: "include",
        });

        const responseData = await response.json();

        if (!response.ok) {
            showMessage(responseData.message, false);
            return;
        }

        if (responseData.length === 0) {
            showMessage("No Packages found!", false);
        }

        const packageContainer = document.getElementById("packageContainer");
        packageContainer.innerHTML = "";

        responseData.forEach((pkg) => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <img src='../${pkg.imgUrl}' alt='${pkg.packageName}'>
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
    window.location.href = `../html/${fileName}?packageId=${packageId}`;
}

document.addEventListener("DOMContentLoaded", displayPackage);
