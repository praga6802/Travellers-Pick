import { showFormMessage, showSessionMessage } from "./error.js";
import { url } from "./config.js";


document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("otp-form");
    const otpinp = document.querySelectorAll(".otp");

    displayUserDetails();

    otpinp.forEach((inp, index) => {
        inp.addEventListener("input", (e) => {
            if (inp.value && index < otpinp.length - 1) {
                otpinp[index + 1].focus();
            }
        });

        inp.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !inp.value && index > 0) {
                otpinp[index - 1].focus();
            }
        });

        inp.addEventListener("paste", (e) => {
            e.preventDefault();
            const pasteData = e.clipboardData.getData("text").trim();
            if (/^\d{6}$/.test(pasteData)) {
                pasteData.split("").forEach((char, i) => {
                    if (otpinp[i]) {
                        otpinp[i].value = char;
                    }
                });
                otpinp[otpinp.length - 1].focus();
            }
        });
    });

    if (form) {
        form.addEventListener("submit", verifyOTP);
    }

    async function displayUserDetails() {
        try {
            const response = await fetch(`${url}/user/current-user`, {
                method: "GET",
                credentials: "include",
            });
            const responseData = await response.json();

            if (!response.ok) {
                form.style.display = "none";
                showSessionMessage(responseData.message, false);
                setTimeout(() => {
                    window.location.href = "../html/admin-login.html";
                }, 1500);
                return;
            }
        } catch (e) {
            console.error("Auth check error:", e);
            showSessionMessage(
                "Network Error or Session Expired. Please login again!",
                false,
            );
            if (form) form.style.display = "none";
            setTimeout(() => {
                window.location.href = "../html/user-login.html";
            }, 1500);
        }
    }

    async function verifyOTP(e) {
        e.preventDefault();
        let otp = "";

        otpinp.forEach((inp) => (otp += inp.value.trim()));

        if (otp.length !== 6) {
            showFormMessage("Please Enter 6-digit OTP", false);
            return;
        }

        const data = { otp };

        try {
            const response = await fetch(`${url}/user/verifyOTP`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const resData = await response.json();

            showFormMessage(
                resData.message ||
                    (response.ok
                        ? "OTP verified successfully!"
                        : "Verification failed"),
                response.ok,
            );

            if (response.ok) {
                setTimeout(() => {
                    window.location.href = "../html/user-login.html";
                }, 1500);
            }
        } catch (e) {
            console.error("OTP verification error:", e);
            showFormMessage("Network error..Please try again", false);
        }
    }
});
