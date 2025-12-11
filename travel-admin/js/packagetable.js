document.addEventListener('DOMContentLoaded', async () => {
    const tbody = document.querySelector('#packagetable tbody');

    try {
        const response = await fetch('http://localhost:8080/admin/packages',
            {
                method:"GET",
                credentials:"include",
                "Content-Type":"application/json"
            }
        );
        if (!response.ok) throw new Error('Failed to fetch packages');

        const packages = await response.json();

        if (packages.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">No packages found</td></tr>';
            return;
        }

        // Populate table
        packages.forEach(pkg => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pkg.packageId}</td>
                <td>${pkg.packageName}</td>
                <td>${pkg.packageSlogan}</td>
            `;
            tbody.appendChild(row);
        });

    } catch (err) {
        console.error(err);
        tbody.innerHTML = '<tr><td colspan="3">Error loading packages</td></tr>';
    }
});
