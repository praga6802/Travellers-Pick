document.addEventListener("DOMContentLoaded", async () => {
    const tbody = document.querySelector("#admintable tbody");

    try {
        const response = await fetch("http://localhost:8080/admin/alladmins", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            console.error("HTTP error", response.status);
            tbody.innerHTML = `<tr><td>Error: ${response.status} - ${response.statusText}</td></tr>`;
            return;
        }

        const details = await response.json();

        if (details.length === 0) {
            tbody.innerHTML = "<tr><td colspan='4'>No admin details found</td></tr>";
            return;
        }

        details.forEach(detail => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${detail.adminId}</td>
                <td>${detail.username}</td>
                <td>${detail.email}</td>
                <td>${detail.contact}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error(err);
        tbody.innerHTML = "<tr><td colspan='4'>Error fetching details</td></tr>";
    }
});
