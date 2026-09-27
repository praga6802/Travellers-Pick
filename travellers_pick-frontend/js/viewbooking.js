import { showSessionMessage } from "./error.js";
import { url } from "./config.js";

const bookingListContainer = document.getElementById("booking-list-container");
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
            bookingListContainer.style.display = "none";
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
            //console.log(response);

            const responseData = await response.json();
            
            console.log(response);
            console.log(responseData);
            if (!response.ok) {
                bookingListContainer.style.display = "none";
                showSessionMessage(responseData.message, false);
                return;
            }


        bookingListContainer.innerHTML = `
            <h1 class="h1">VIEW BOOKINGS</h1>
            <div id="booking-card"></div>
        `;

        const bookingCard = document.getElementById("booking-card");

        responseData.forEach((booking) => {
            let statusClass = "";
            const statusUpper = (booking.status || "").toUpperCase();

            if (statusUpper === "CONFIRMED") {
                statusClass = "status-confirmed";
            } else if (statusUpper === "CANCELLED") {
                statusClass = "status-cancelled";
            } else if (statusUpper === "PENDING") {
                statusClass = "status-pending";
            }

            bookingCard.innerHTML = `
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

            bookingListContainer.appendChild(bookingCard);
        });
    } catch (err) {
        showSessionMessage("Network error..Please try again", false);
        console.error(err);
    }
}

document.addEventListener("DOMContentLoaded", handleViewBooking);
