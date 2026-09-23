export function showFormMessage(message, isSuccess) {
    const formError = document.getElementById("form-error");

    if (!formError) {
        return;
    }

    formError.textContent = message;

    if (isSuccess) {
        formError.classList.remove("failure");
        formError.classList.add("success");
    } else {
        formError.classList.remove("success");
        formError.classList.add("failure");
    }
}

export function showSessionMessage(message, isSuccess) {
    const sessionError = document.getElementById("session-error");

    if (!sessionError) {
        return;
    }

    sessionError.textContent = message;

    if (isSuccess) {
        sessionError.classList.remove("failure");
        sessionError.classList.add("success");
    } else {
        sessionError.classList.remove("success");
        sessionError.classList.add("failure");
    }
}
