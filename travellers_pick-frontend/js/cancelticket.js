import { showFormMessage, showSessionMessage } from "./error.js";
import { url } from "./config.js";

const cancelContainer = document.getElementById("cancel-container");
const adminHeader = document.getElementById("adminHeader");
const userLinks = document.querySelector(".user-links");

const displayCancelForm = async () => {
    try {
        const authResponse = await fetch(`${url}/user/current-user`, {
            method: "GET",
            credentials: "include",
        });

        const authData = await authResponse.json();

        if (!authResponse.ok) {
            cancelContainer.style.display = "none";
            adminHeader.style.display = "none";
            userLinks.style.display = "none";
            showSessionMessage(authData.message, false);

            setTimeout(() => {
                window.location.href = "../html/user-login.html";
            }, 1500);
            return;
        }

        cancelContainer.innerHTML = `
            <h1 id="cancel-legend">Booking Cancellation</h1>
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-12">
                        <form id="cancelform" method="post">
                            <div id="input">
                                <label for="pnr">PNR Number</label>
                                <input type="text" name="PNR" id="pnr" placeholder="Enter PNR Number" minlength="6"
                                    class="input" required>
                            </div>

                            <div class="button-group">
                                <button type="submit" id="submit" class="button">SUBMIT</button>
                                <button type="reset" id="reset" class="button">RESET</button>
                            </div>

                            <p id="form-error"></p>
                        </form>
                    </div>
                </div>
            </div>
        `;

        const cancelForm = document.getElementById("cancelform");
        cancelForm.addEventListener("submit", handleCancel);
    } catch (err) {
        showSessionMessage("Network error..Please try again!");
        console.error(err);
    }
};

async function handleCancel(event) {
    event.preventDefault();

    const cancelTicketForm = e.target;
    const form_error = document.getElementById("form-error");

    const pnrInp = document.getElementById("pnr");
    const PNR_NUMBER = pnrInp.value.trim();

    if (!PNR_NUMBER) {
        showFormMessage("Please enter your PNR number.", false);
        return;
    }

    try {
        const response = await fetch(`${url}/user/bookings/cancel`, {
            method: "DELETE",
            credentials: "include",
            body: JSON.stringify({ pnr: PNR_NUMBER }),
            headers: { "Content-Type": "application/json" },
        });

        const responseData = await response.json();

        if (!response.ok) {
            showFormMessage(responseData.message, true);
            pnrInp.value = "";
        }
        showFormMessage(responseData.message, true);

        setTimeout(() => {
            form_error.classList.add("hide");
            cancelTicketForm.reset();
        }, 2000);
    } catch (e) {
        console.error("Cancellation Error:", e);
        showSessionMessage("Network Error. Please try again.", false);
    }
}

document.addEventListener("DOMContentLoaded", displayCancelForm);
