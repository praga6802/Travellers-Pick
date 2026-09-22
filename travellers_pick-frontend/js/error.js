export function showMessage(message, isSuccess) {
    const error = document.getElementById("error");

    if (!error) {
        return;
    }

    if (!message) {
        error.style.display = "none";
        error.textContent = "";
        return;
    }

    error.textContent = message;
    
    if (isSuccess) {
        error.classList.remove("failure");
        error.classList.add("success");
    } else {
        error.classList.remove("success");
        error.classList.add("failure");
    }
}
