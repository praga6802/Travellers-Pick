(function () {
    window.addEventListener("DOMContentLoaded", handleViewBooking);

    async function handleViewBooking() {
        const errorMsg = document.getElementById("profile-error");
        const cardContainer = document.getElementById("booking-card");

        if (errorMsg) {
            errorMsg.style.display = "none";
        }

        try {
            const response = await fetch(
                "http://localhost:8080/user/bookedTours",
                {
                    method: "GET",
                    credentials: "include",
                },
            );

            const responseData = await response.json();
            if (response.status === 401) {
                showError(errorMsg, responseData.message);
            }
            if (!response.ok) {
                showError(errorMsg, responseData.message);
                return;
            }
            const bookings = Array.isArray(responseData)
                ? responseData
                : responseData.data;

            if (!bookings || !Array.isArray(bookings)) {
                showError(errorMsg, "No bookings found!");
                return;
            }

            cardContainer.innerHTML = "";

            bookings.forEach((booking) => {
                const card = document.createElement("div");
                card.classList.add("booking-card");

                // Determine status class
                let statusClass = "";
                if (booking.status === "CONFIRMED") {
                    statusClass = "status-confirmed";
                } else if (booking.status === "CANCELLED") {
                    statusClass = "status-cancelled";
                } else if (booking.status === "PENDING") {
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
                            <strong>Booked Date:</strong> ${booking.bookedAt || "N/A"}
                        </span>
                        <span class="date">
                            <strong>Travel Date:</strong> ${booking.travelAt || "N/A"}
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
                `;

                cardContainer.appendChild(card);
            });
        } catch (e) {
            console.error("View Bookings Error:", e);
            showError(errorMsg, "Network Error. Please try again!");
        }
    }

    function showError(element, message) {
        if (!element) return;
        element.textContent = message;
        element.classList.remove("success");
        element.classList.add("failure");
        element.style.display = "inline-block";
    }
})();
