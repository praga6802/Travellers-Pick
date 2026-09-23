import { showSessionMessage } from "./error.js";
import { url } from "./config.js";

const bookingList = document.getElementById("booking-list");
const user_links = document.querySelector(".user-links");
const userHeader = document.getElementById("user-header");

async function handleViewBooking() {
    try {
        const authResponse = await fetch(`${url}/user/current-user`, {
            method: "GET",
            credentials: "include",
        });
        const authData = await authResponse.json();

        if (!authResponse.ok) {
            userHeader.style.display = "none";
            user_links.style.display = "none";
            bookingList.style.display = "none";
            showSessionMessage(authData.message, false);
            setTimeout(() => {
                window.location.href = "../html/user-login.html";
            }, 1500);
            return;
        }

        const response = await fetch(`${url}/user/bookedTours`, {
            method: "GET",
            credentials: "include",
        });

        const responseData = await response.json();

        if (!response.ok) {
            bookingList.style.display = "none";
            showSessionMessage("Failed to load bookings!", false);
            return;
        }

        if (responseData.length === 0) {
            bookingList.style.display = "none";
            showSessionMessage("No bookings found!", false);
            return;
        }

        bookingList.innerHTML = `
            <h1 class="h1">VIEW BOOKINGS</h1>
            <div id="booking-card"></div>
        `;

        const cardContainer = document.getElementById("booking-card");

        responseData.forEach((booking) => {
            const card = document.createElement("div");
            card.classList.add("booking-card");

            let statusClass = "";
            const statusUpper = (booking.status || "").toUpperCase();

            if (statusUpper === "CONFIRMED") {
                statusClass = "status-confirmed";
            } else if (statusUpper === "CANCELLED") {
                statusClass = "status-cancelled";
            } else if (statusUpper === "PENDING") {
                statusClass = "status-pending";
            }

            card.innerHTML = `
                <div class="booking-header">
                    ${booking.packageName || "Package"} - ${booking.region || ""}
                    <h4 class="status ${statusClass}">
                        <span>${booking.status || "UNKNOWN"}</span>
                    </h4>
                </div>
                
                <div class="date-info">
                    <span class="date">
                        <strong>Booked Date:</strong> ${booking.bookedAt || booking.bdate || "N/A"}
                    </span>
                    <span class="date">
                        <strong>Travel Date:</strong> ${booking.travelAt || booking.tdate || "N/A"}
                    </span>
                </div>

                <div class="booking-body">
                    <p><strong>Booking ID:</strong> ${booking.bookingId || booking.id || "N/A"}</p>
                    <p><strong>Name:</strong> ${booking.userName || booking.name || "N/A"}</p>
                    <p><strong>Email:</strong> ${booking.email || "N/A"}</p>
                    <p><strong>Contact:</strong> ${booking.contact || booking.phone || "N/A"}</p>
                    <p><strong>Seats:</strong> ${booking.noOfSeats || 0}</p>
                    <p><strong>Adults:</strong> ${booking.noOfAdults || 0}</p>
                    <p><strong>Children:</strong> ${booking.noOfChildren || 0}</p>
                    <p><strong>Price:</strong> ${booking.price || "N/A"}</p>
                </div>
            `;

            cardContainer.appendChild(card);
        });
    } catch (err) {
        showSessionMessage("Network error..Please try again", false);
        console.error(err);
    }
}

document.addEventListener("DOMContentLoaded", handleViewBooking);
