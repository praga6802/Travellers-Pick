const error = document.getElementById("error");
error.style.display = "none";
const formContainer = document.getElementById("formData");
const iternaryContainer = document.getElementById("iternaryContainer");

let iternaryData = [];
let userId = 0;

async function displayUserName() {
    try {
        const response = await fetch(
            "http://localhost:8080/user/current-user",
            {
                method: "GET",
                credentials: "include",
            },
        );

        const responseData = await response.json();
        console.log(responseData);

        if (response.ok) {
            userId = responseData.data.userId;
            return true;
        } else if (response.status === 401) {
            userId = null;
            error.style.display = "inline-block";
            error.textContent = "Session Expired! Please login again.";
            error.classList.remove("success");
            error.classList.add("failure");

            setTimeout(() => {
                window.location.href = "../index.html";
            }, 2000);
            return false;
        }
    } catch (err) {
        console.error(err);
        error.textContent = err;
        error.classList.remove("success");
        error.classList.add("failure");
        return false;
    }
}

//load all iternaries and selecting according to the tour id
document.addEventListener("DOMContentLoaded", async function loadIternaries() {
    const logged = await displayUserName();
    if (!logged) return;

    try {
        const response = await fetch(
            "http://localhost:8080/user/allIternaries",
            {
                method: "GET",
                credentials: "include",
            },
        );
        const responseData = await response.json();

        if (!response.ok) {
            error.innerText = responseData.message;
            return;
        }
        if (!responseData || responseData.length === 0) {
            error.innerText = "No Iternaries Found!";
            return;
        }
        iternaryData = responseData;

        const url = new URLSearchParams(window.location.search);
        const tourId = parseInt(url.get("tourId"));
        showIternaries(tourId);

        console.log(responseData);
    } catch (e) {
        console.error("Failed to load Iternaries:", e);
        error.innerText = "Network Error.. Unable to reach server!";
    }
});

//show iternary for corresponding tour id
function showIternaries(tourId) {
    if (!iternaryData || iternaryData.length === 0) {
        error.innerText = "No Iternaries Found!";
        return;
    }

    const iternaries = iternaryData.filter((it) => it.tourId == tourId);
    if (!iternaries || iternaries.length == 0) {
        error.innerText = `No Iternaries found for this tour`;
        return;
    }

    let html = `
        <h1 class="h1">ITINERARY</h1>
        <table class='table'>
            <tr class='thead'>
                <th>Day</th>
                <th>Destination</th>
                <th>Activities</th>
            </tr>
    `;

    iternaries.forEach((it) => {
        html += `
            <tr class='tbody'>
                <td class='data'>${it.dayNumber}</td>
                <td class='data'>${it.destination}</td>
                <td class='data'>${it.description}</td>
            </tr>
        `;
    });
    html += `</table>`;
    iternaryContainer.innerHTML = html;

    const it = iternaries[0];

    // creating form container for booking
    formContainer.innerHTML += `
    <h1 class="h1">BOOKING FORM</h1>
      <form method="POST" id="tourForm">
        <label for="name">Name</label>
        <input type="text" id="name" placeholder="Enter your Name" name="name" required><br><br>

        <label for="email">Email</label>
        <input type="email" id="email" placeholder="Enter your Email" name="email" required><br><br>

        <label for="phone">Phone</label>
        <input type="tel" id="phone" placeholder="10-digit Mobile Number" name="phone" required pattern="[0-9]{1,10}"
          maxlength="10"><br><br>

        <input type="hidden" id="userId" name="userId" value="" required>
        <input type="hidden" id="tourId" name="tourId" value="${it.tourId}" required>
        <input type="hidden" id="packageName" name="packageName" value="${it.packageName}" required>
        <input type="hidden" id="region" name="region" value="${it.tourName}">
        <input type="hidden" id="bdate" name="bdate" min="" max="" required>
    
        <label for="travel-date">Travel Date</label>
        <input type="date" id="tdate" name="tdate" min="" max="2030-12-31" required><br><br>
      
        <label for="num-adults">Adults</label>
        <input type="number" id="noOfAdults" placeholder="No of Adults" name="noOfAdults" min="1" max="30"
          required><br><br>

        <label for="num-seats">Children</label>
        <input type="number" id="noOfChildren" placeholder="No of Children" name="noOfChildren" min="0"
          max="30"><br><br>

        <label for="name">City</label>
        <input type="text" id="city" placeholder="City" name="city" required><br><br>

        <label for="state">State</label>
        <input type="text" id="state" placeholder="State" name="state" required><br><br>

        <label for="country">Country</label>
        <input type="text" id="country" placeholder="Country" name="country" required><br><br>

        <input type="submit" value="Submit">
      </form>`;
    const today = new Date().toISOString().split("T")[0];
    const bdate = document.getElementById("bdate");
    const tdate = document.getElementById("tdate");
    bdate.value = today;
    bdate.min = today;
    bdate.max = today;

    tdate.value = today;
    tdate.min = today;

    const form = document.getElementById("tourForm");
    document.getElementById("userId").value = userId;
    //sending the form
    form.addEventListener("submit", handleForm);
    async function handleForm(event) {
        event.preventDefault();
        const userId = parseInt(document.getElementById("userId").value.trim());
        const tourId = parseInt(document.getElementById("tourId").value.trim());

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const packageName = document.getElementById("packageName").value.trim();
        const region = document.getElementById("region").value.trim();
        const bdate = document.getElementById("bdate").value.trim();
        const tdate = document.getElementById("tdate").value.trim();
        const noOfAdults =
            parseInt(document.getElementById("noOfAdults").value.trim()) || 0;
        const noOfChildren =
            parseInt(document.getElementById("noOfChildren").value.trim()) || 0;
        const city = document.getElementById("city").value.trim();
        const state = document.getElementById("state").value.trim();
        const country = document.getElementById("country").value.trim();

        const noOfSeats = noOfAdults + noOfChildren;

        const data = {
            userId,
            tourId,
            name,
            email,
            phone,
            packageName,
            region,
            bdate,
            tdate,
            noOfSeats,
            noOfAdults,
            noOfChildren,
            city,
            state,
            country,
        };

        if (
            Object.values(data).some(
                (value) =>
                    value === "" || value === null || value === undefined,
            )
        ) {
            alert("Please fill customer details");
            return;
        }
        const pkgName = encodeURIComponent(packageName);
        try {
            const response = await fetch(
                `http://localhost:8080/user/${pkgName}/book`,
                {
                    method: "POST",
                    body: JSON.stringify(data),
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                },
            );

            const responseData = await response.json();
            if (response.ok) {
                error.style.display = "inline-block";
                error.textContent = responseData.message;
                error.classList.remove("failure");
                error.classList.remove("success");
                setTimeout(() => form.reset(), 2000);
            } else if (response.status === 401) {
                error.style.display = "inline-block";
                error.textContent = responseData.message;
                error.classList.remove("success");
                error.classList.add("failure");
            } else {
                error.style.display = "inline-block";
                error.textContent = responseData.message;
                error.classList.remove("success");
                error.classList.add("failure");
            }
        } catch (err) {
            console.error(err);
            error.style.display = "inline-block";
            error.textContent = message;
            error.classList.remove("success");
            error.classList.add("failure");
        }
    }

    //reset the form
    form.addEventListener("reset", () => {
        error.style.display = "none";
    });
}
