import { showSessionMessage } from "./error.js";
import { url } from "./config.js";

const cardContainer = document.getElementById("booking-card");
async function handleViewBooking() {
    try {
        const response = await fetch(`${url}/user/bookedTours`, {
            method: "GET",
            credentials: "include",
        });

        const responseData = await response.json();

        if (response.status === 401) {
            cardContainer.style.display = "none";
            showSessionMessage(responseData.message, false);
            setTimeout(() => {
                window.location.href = "../html/user-login.html";
            }, 1500);
            return;
        }

        if (!response.ok) {
            cardContainer.style.display = "none";
            showSessionMessage("Failed to load bookings!", false);
            return;
        }

        if (bookings.length === 0) {
            cardContainer.style.display = "none";
            showSessionMessage("No bookings found!", false);
            return;
        }

        cardContainer.innerHTML = "";

        bookings.forEach((booking) => {
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
