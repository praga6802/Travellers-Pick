import { showSessionMessage } from "./error.js";
import { url } from "./config.js";

const bookingListContainer = document.getElementById("booking-list-container");
const user_links = document.getElementById("user-links");

async function handleViewBooking() {
    try {
        const authResponse = await fetch(`${url}/user/current-user`, {
            method: "GET",
            credentials: "include",
        });
        const authData = await authResponse.json();

        if (!authResponse.ok) {
            user_links.style.display = "none";
            bookingListContainer.style.display = "none";
            showSessionMessage(authData.message, false);
            setTimeout(() => {
                window.location.href = "../html/user-login.html";
            }, 1500);
            return;
        }

        const response = await fetch(`${url}/user/bookings`, {
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

        if (responseData.data.length == 0 || !responseData.data) {
            bookingListContainer.style.display = "none";
            showSessionMessage("No Bookings found");
            return;
        }

        bookingListContainer.innerHTML = `
            <h1 class="h1">VIEW BOOKINGS</h1>
            <div class="container">
                <div class="row justify-content-center" id="booking-row">
                </div>
            </div>
        `;

        const bookingRow = document.getElementById("booking-row");

        responseData.data.forEach((booking) => {
            let statusClass = "";
            const statusUpper = (booking.status || "").toUpperCase();

            if (statusUpper === "CONFIRMED") {
                statusClass = "status-confirmed";
            } else if (statusUpper === "CANCELLED") {
                statusClass = "status-cancelled";
            } else if (statusUpper === "PENDING") {
                statusClass = "status-pending";
            }
            const bookingCol = document.createElement("div");
            bookingCol.className = "col-12";

            bookingCol.innerHTML = `
            <div class="booking-card">
                <div class="booking-header">
                    ${booking.packageName}
                    <h4 class="status ${statusClass}">
                        <span>${booking.status}</span>
                    </h4>
                </div>

                <div class="date-info">
                    <span class="date">
                        <strong>Booked Date:</strong> ${booking.bookedAt}
                    </span>
                    <span class="date">
                        <strong>Travel Date:</strong> ${booking.travelAt}
                    </span>
                </div>

                <div class="booking-body">
                    <p><strong>Booking ID:</strong> ${booking.bookingId}</p>

                    <p><strong>Name:</strong> ${booking.userName}</p>
                    <p><strong>Email:</strong> ${booking.email}</p>
                    <p><strong>Contact:</strong> ${booking.contact}</p>
                    <p><strong>Seats:</strong> ${booking.noOfSeats}</p>
                    <p><strong>Adults:</strong> ${booking.noOfAdults}</p>
                    <p><strong>Children:</strong> ${booking.noOfChildren}</p>
                    <p><strong>Price:</strong> ${booking.price}</p>

                </div>
            </div>
            `;

            bookingRow.appendChild(bookingCol);
        });
    } catch (err) {
        showSessionMessage("Network error..Please try again", false);
        console.error(err);
    }
}

document.addEventListener("DOMContentLoaded", handleViewBooking);
