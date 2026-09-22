// const error = document.getElementById("error");

document.addEventListener("DOMContentLoaded", displayPackage);
async function displayPackage() {
    try {
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

        const tourContainer = document.getElementById("packageContainer");
        tourContainer.innerHTML = "";

        responseData.forEach((pkg) => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
        <img src='../${pkg.imgUrl}' alt='${pkg.packageName}'>
        <h2 class="package-title">${pkg.packageName}</h2>
        <h6 class="package-slogan"> -${pkg.packageSlogan}- </h6>
        <button class='explore-button' onclick="tourChange('${pkg.fileName}','${pkg.packageId}')">EXPLORE</button>
        `;
            tourContainer.appendChild(card);
        });
    } catch (e) {
        showMessage(e.message, false);
        console.error("Failed to fetch:", e);
    }
}

function tourChange(fileName, packageId) {
    window.location.href = `../html/${fileName}?packageId=${packageId}`;
}

function showMessage(message, isSuccess) {
    error.textContent = message;
    if (isSuccess) {
        error.classList.remove("failure");
        error.classList.add("success");
    } else {
        error.classList.remove("success");
        error.classList.add("failure");
    }
}
