import { showMessage } from "./error.js";

const total_admins = document.getElementById("total-admins");
const total_users = document.getElementById("total-users");
const total_packages = document.getElementById("total-packages");
const total_tours = document.getElementById("total-tours");
const total_bookings = document.getElementById("total-bookings");
const total_confirm = document.getElementById("confirmed");
const total_cancel = document.getElementById("cancelled");

async function displayUserName() {
    console.log("Cookies before fetch:", document.cookie);
    try {
        const response = await fetch(`${url}/admin/adminData`, {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            const username = data.username;
            const userNameOption = document.getElementById("usernameoption");
            userNameOption.innerText = `Hello ${username}`;
            userNameOption.value = "default";
        } else {
            const error = await response.json();
            console.log(error);
        }
    } catch (err) {
        console.error("Error Fetching Admin Info", err);
        window.location.href = "../html/admin-login.html";
    }
}

async function handleLogout(select) {
    if (select.value == "logout") {
        try {
            const response = await fetch(`${url}/admin/logout`, {
                method: "POST",
                credentials: "include",
            });
            if (response.ok) {
                const res = await response.json();
                alert(res.message);
                window.location.href = "../html/admin-login.html";
            } else {
                alert("Logout Failed. Try again.");
            }
        } catch (err) {
            alert("Error: Session Expired & Cannot fetch user details");
            console.log(err);
        }
    } else {
        select.value = "default";
    }
}

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
