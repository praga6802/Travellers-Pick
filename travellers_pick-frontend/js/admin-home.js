import { showMessage } from "./error.js";
import { url } from "./config.js";

const total_admins = document.getElementById("total-admins");
const total_users = document.getElementById("total-users");
const total_packages = document.getElementById("total-packages");
const total_tours = document.getElementById("total-tours");
const total_bookings = document.getElementById("total-bookings");
const total_confirm = document.getElementById("confirmed");
const total_cancel = document.getElementById("cancelled");

async function displayUserName() {
    try {
        const response = await fetch(`${url}/admin/current-admin`, {
            method: "GET",
            credentials: "include",
        });
        const responseData = await response.json();

        if (!response.ok) {
            console.log("admin not logged in or session expired!");
            return;
        }

        const adminSelect = document.createElement("select");
        adminSelect.className = "admin-select";
        adminSelect.id = "adminSelect";

        const greetingOption = document.createElement("option");
        greetingOption.textContent = responseData.username;
        greetingOption.disabled = true;
        greetingOption.selected = true;

        const logoutOption = document.createElement("option");
        logoutOption.value = "logout";
        logoutOption.textContent = "Logout";

        adminSelect.appendChild(greetingOption);
        adminSelect.appendChild(logoutOption);

        adminSelect.addEventListener("change", () => {
            handleLogout(adminSelect);
        });

        const adminContainer = document.getElementById("webpreview");
        adminContainer.appendChild(adminSelect);
        
    } catch (err) {
        showMessage("Network error..Please try again!", false);
        console.error(err);
        setTimeout(() => {
            window.location.href = "../html/admin-login.html";
        }, 2000);
    }
}

async function handleLogout(select) {
    if (select.value == "logout") {
        try {
            const response = await fetch(`${url}/admin/logout`, {
                method: "POST",
                credentials: "include",
            });

            const responseData = await response.json();
            if (response.ok) {
                alert(responseData.message);
                setTimeout(() => {
                    window.location.href = "../html/admin-login.html";
                }, 1500);
            } else {
                alert("Logout Failed. Try again.");
                console.log(responseData);
            }
        } catch (err) {
            alert("Network error..Please try again!");
            console.log(err);
        }
    } else {
        select.selectedIndex = 0;
    }
}

// admin analytics
const getAdmins = async () => {
    try {
        const response = await fetch(`${url}/admin/getAdmins`, {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            total_admins.innerText = data.data;
        } else {
            console.log("Failed to fetch admin account");
        }
    } catch (err) {
        console.error(err);
    }
};

const getUsers = async () => {
    try {
        const response = await fetch(`${url}/admin/getUsers`, {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            total_users.innerText = data.data;
        } else {
            console.log("Failed to fetch admin account");
        }
    } catch (err) {
        console.error(err);
    }
};

const getPackages = async () => {
    try {
        const response = await fetch(`${url}/admin/getPackages`, {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            total_packages.innerText = data.data;
        } else {
            console.log("Failed to fetch admin account");
        }
    } catch (err) {
        console.error(err);
    }
};

const getTours = async () => {
    try {
        const response = await fetch(`${url}/admin/getTours`, {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            total_tours.innerText = data.data;
        } else {
            console.log("Failed to fetch admin account");
        }
    } catch (err) {
        console.error(err);
    }
};

const getBookings = async () => {
    try {
        const response = await fetch(`${url}/admin/getBookings`, {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            total_bookings.innerText = data.data;
        } else {
            console.log("Failed to fetch admin account");
        }
    } catch (err) {
        console.error(err);
    }
};

const getConfirmedCount = async () => {
    try {
        const response = await fetch(`${url}/admin/getConfirmed`, {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            total_confirm.innerText = data.data;
        } else {
            console.log("Failed to fetch admin account");
        }
    } catch (err) {
        console.error(err);
    }
};

const getCancelledCount = async () => {
    try {
        const response = await fetch(`${url}/admin/getCancelled`, {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            total_cancel.innerText = data.data;
        } else {
            console.log("Failed to fetch admin account");
        }
    } catch (err) {
        console.error(err);
    }
};

getAdmins();
getUsers();
getPackages();
getTours();
getBookings();
getConfirmedCount();
getCancelledCount();

window.addEventListener("DOMContentLoaded", displayUserName);
