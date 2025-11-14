document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("addpackageform");
    const msg = document.getElementById("error"); // <-- this is your <p>

    form.addEventListener("submit", async function handleAdd(event) {
        event.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch("http://localhost:8080/admin/addpackage", {
                method: "POST",
                body: formData
            });

            const text = await response.text(); // read response
            let data;
            try {
                data = JSON.parse(text); // try JSON parse
            } catch {
                data = { message: text }; // fallback to text
            }

            if (response.ok) {
                msg.style.color = "yellowgreen";       // success → green
                msg.innerText = data.message || "Package Added Successfully";                // reset form fields
            } else {
                msg.style.color = "orange";      // error → orange
                msg.innerText = data.error || "Something went wrong";
            }

        } catch(err) {
            msg.style.color = "red";             // network error → red
            msg.innerText = "Network Error..Please try again";
            console.error(err);
        }
    });
});
