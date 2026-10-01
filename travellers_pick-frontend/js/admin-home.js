import { showFormMessage, showSessionMessage } from "./error.js";
import { url } from "./config.js";

const total_admins = document.getElementById("total-admins");
const total_users = document.getElementById("total-users");
const total_packages = document.getElementById("total-packages");
const total_tours = document.getElementById("total-tours");
const total_bookings = document.getElementById("total-bookings");
const total_confirm = document.getElementById("confirmed");
const total_cancel = document.getElementById("cancelled");

const signin = document.getElementById("signin-btn");
const login = document.getElementById("login-btn");

const adminMain = document.querySelector(".admin-main");
const adminSidebar = document.getElementById("adminSidebar");
const adminHeader = document.getElementById("adminHeader");

async function displayUserName() {
    try {
        const response = await fetch(`${url}/admin/current-admin`, {
            method: "GET",
            credentials: "include",
        });
        const responseData = await response.json();

        if (!response.ok) {
            adminSidebar.style.display = "none";
            adminHeader.style.display = "none";
            adminMain.style.display = "none";

            showSessionMessage(responseData.message, false);
            setTimeout(() => {
                window.location.href = "../html/admin-login.html";
            }, 1500);
            return;
        }

        const adminSelect = document.createElement("select");
        adminSelect.className = "admin-select";
        adminSelect.id = "adminSelect";

        const greetingOption = document.createElement("option");
        greetingOption.textContent = responseData.data.username;
        greetingOption.disabled = true;
        greetingOption.selected = true;

        const logoutOption = document.createElement("option");
        logoutOption.value = "logout";
        logoutOption.textContent = "Logout";

        adminSelect.appendChild(greetingOption);
        adminSelect.appendChild(logoutOption);


        if (login) {
            login.replaceWith(adminSelect);
        } else {
            adminHeader.appendChild(adminSelect);
        }

        if (signin) {
            signin.style.display = "none";
        }

        adminSelect.addEventListener("change", handleLogout);
    } catch (err) {
        showSessionMessage("Network error..Please try again!", false);
        console.error(err);
        setTimeout(() => {
            window.location.href = "../html/admin-login.html";
        }, 2000);
    }
}

async function handleLogout(e) {
    if (e.target.value === "logout") {
        try {
            const response = await fetch(`${url}/admin/logout`, {
                method: "POST",
                credentials: "include",
            });

            const responseData = await response.json();
            if (response.ok) {
                showSessionMessage(responseData.message);
                setTimeout(() => {
                    window.location.href = "../html/admin-login.html";
                }, 1500);
            } else {
                showSessionMessage("Logout Failed. Try again.");
                console.log(responseData);
            }
        } catch (err) {
            showSessionMessage("Network error..Please try again!");
            console.log(err);
            e.target.selectedIndex=0;
        }
    } else {
        e.target.selectedIndex = 0;
    }
}

// admin analytics
const getAdmins = async () => {
    try {
        const response = await fetch(`${url}/admin/admins/count`, {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            total_admins.innerText = data.data;
        } else {
            showFormMessage("Failed to fetch", false);
            return;
        }
    } catch (err) {
        showSessionMessage("Network error..Please try again");
        console.log(err);
    }
};

const getUsers = async () => {
    try {
        const response = await fetch(`${url}/admin/users/count`, {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            total_users.innerText = data.data;
        } else {
            showFormMessage("Failed to fetch", false);
            return;
        }
    } catch (err) {
        showSessionMessage("Network error..Please try again");
        console.log(err);
    }
};

const getPackages = async () => {
    try {
        const response = await fetch(`${url}/admin/packages/count`, {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            total_packages.innerText = data.data;
        } else {
            showFormMessage("Failed to fetch", false);
            return;
        }
    } catch (err) {
        showSessionMessage("Network error..Please try again");
        console.log(err);
    }
};

const getTours = async () => {
    try {
        const response = await fetch(`${url}/admin/tours/count`, {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            total_tours.innerText = data.data;
        } else {
            showFormMessage("Failed to fetch", false);
            return;
        }
    } catch (err) {
        showSessionMessage("Network error..Please try again");
        console.log(err);
    }
};

const getBookings = async () => {
    try {
        const response = await fetch(`${url}/admin/bookings/count`, {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            total_bookings.innerText = data.data;
        } else {
            showFormMessage("Failed to fetch", false);
            return;
        }
    } catch (err) {
        showSessionMessage("Network error..Please try again");
        console.log(err);
    }
};

const getConfirmedCount = async () => {
    try {
        const response = await fetch(`${url}/admin/confirmed/count`, {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            total_confirm.innerText = data.data;
        } else {
            showFormMessage("Failed to fetch", false);
            return;
        }
    } catch (err) {
        showSessionMessage("Network error..Please try again");
        console.log(err);
    }
};

const getCancelledCount = async () => {
    try {
        const response = await fetch(`${url}/admin/cancelled/count`, {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            total_cancel.innerText = data.data;
        } else {
            showFormMessage("Failed to fetch", false);
            return;
        }
    } catch (err) {
        showSessionMessage("Network error..Please try again");
        console.log(err);
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
