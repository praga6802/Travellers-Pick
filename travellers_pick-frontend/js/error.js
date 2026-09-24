export function showFormMessage(message, isSuccess) {
    const formError = document.getElementById("form-error");

    if (!formError) {
        return;
    }

    formError.textContent = message;
    formError.classList.remove("success", "failure", "hide");

    if (isSuccess) {
        formError.classList.add("success");
    } else {
        formError.classList.add("failure");
    }
}

export function showSessionMessage(message, isSuccess) {
    const sessionError = document.getElementById("session-error");

    if (!sessionError) {
        return;
    }

    sessionError.textContent = message;
    sessionError.classList.remove("success", "failure");

    if (isSuccess) {
        sessionError.classList.add("success");
    } else {
        sessionError.classList.add("failure");
    }
}
