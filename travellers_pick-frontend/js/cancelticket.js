import { showMessage } from "./error.js";
import { url } from "./config.js";
document.addEventListener("DOMContentLoaded", () => {
    const cancelContainer = document.getElementById("cancel-container");
    if (!cancelContainer) return;

    cancelContainer.innerHTML = `
        <form id="cancelform" method="post">
            <legend id="cancel-legend">Booking Cancellation</legend>

            <div id="input">
                <label for="pnr">PNR Number</label>
                <input
                    type="text"
                    name="PNR"
                    id="pnr"
                    placeholder="Enter PNR Number"
                    minlength="6"
                    class="input"
                    required
                >
            </div>

            <div class="button-group">
                <button type="submit" id="submit" class="button">SUBMIT</button>
                <button type="reset" id="reset" class="button">RESET</button>
            </div>
        </form>
    `;

    const cancelForm = document.getElementById("cancelform");
    cancelForm.addEventListener("submit", handleCancel);
    cancelForm.addEventListener("reset", () => {
        showMessage("", true);
    });
});

async function handleCancel(event) {
    event.preventDefault();
    const pnrInp = document.getElementById("pnr");
    const PNR_NUMBER = pnrInp.value.trim();

    if (!PNR_NUMBER) {
        showMessage("Please enter your PNR number.", false);
        return;
    }

    try {
        const response = await fetch(`${url}/user/cancelTour`, {
            method: "DELETE",
            credentials: "include",
            body: JSON.stringify({ pnr: PNR_NUMBER }),
            headers: { "Content-Type": "application/json" },
        });

        const responseData = await response.json();

        if (response.ok) {
            showMessage(
                responseData.message || "Booking cancelled successfully.",
                true,
            );
            pnrInp.value = "";
        } else if (response.status === 401) {
            showMessage("Session Expired. Please login again.", false);
            setTimeout(() => {
                window.location.href = "../html/user-login.html";
            }, 2000);
        } else {
            showMessage(
                responseData.message || "Failed to cancel booking.",
                false,
            );
        }
    } catch (e) {
        console.error("Cancellation Error:", e);
        showMessage("Network Error. Please try again.", false);
    }
}
