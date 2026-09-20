document.addEventListener("DOMContentLoaded", async () => {
    const tbody = document.querySelector("#packagetable tbody");

    try {
        const response = await fetch("http://localhost:8080/admin/allPackages", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const details = await response.json();

        if (details.length === 0) {
            tbody.innerHTML = "<tr><td colspan='3'>No Package details found</td></tr>";
            return;
        }

        details.forEach(detail => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${detail.packageId}</td>
                <td>${detail.packageName}</td>
                <td>${detail.packageSlogan}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error(err);
        tbody.innerHTML = "<tr><td colspan='3'>Error fetching package details</td></tr>";
    }
});
