document.addEventListener("DOMContentLoaded", function () {

    // ===============================
    // FAMILY REGISTRATION
    // ===============================
    const familyForm = document.getElementById("familyForm");

    if (familyForm) {
        familyForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const family = {
                name: document.getElementById("familyName").value,
                email: document.getElementById("familyEmail").value,
                phone: document.getElementById("familyPhone").value,
                needs: document.getElementById("familyNeeds").value
            };

            let families = JSON.parse(localStorage.getItem("families")) || [];
            families.push(family);
            localStorage.setItem("families", JSON.stringify(families));

            alert("Family Registered Successfully!");

            // Redirect to dashboard after short delay
            setTimeout(() => {
                window.location.href = "employee-dashboard.html";
            }, 800);
        });
    }


    // ===============================
    // VOLUNTEER REGISTRATION
    // ===============================
    const volunteerForm = document.getElementById("volunteerForm");

    if (volunteerForm) {
        volunteerForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const volunteer = {
                name: document.getElementById("volName").value,
                email: document.getElementById("volEmail").value,
                skills: document.getElementById("volSkills").value,
                availability: document.getElementById("volAvailability").value
            };

            let volunteers = JSON.parse(localStorage.getItem("volunteers")) || [];
            volunteers.push(volunteer);
            localStorage.setItem("volunteers", JSON.stringify(volunteers));

            alert("Volunteer Registered Successfully!");

            setTimeout(() => {
                window.location.href = "employee-dashboard.html";
            }, 800);
        });
    }


    // ===============================
    // DISPLAY DATA ON DASHBOARD
    // ===============================
    const familyTable = document.querySelector("#familyTable tbody");
    const volunteerTable = document.querySelector("#volunteerTable tbody");

    if (familyTable) {
        let families = JSON.parse(localStorage.getItem("families")) || [];

        families.forEach(f => {
            const row = `
                <tr>
                    <td>${f.name}</td>
                    <td>${f.email}</td>
                    <td>${f.phone}</td>
                    <td>${f.needs}</td>
                </tr>
            `;
            familyTable.innerHTML += row;
        });
    }

    if (volunteerTable) {
        let volunteers = JSON.parse(localStorage.getItem("volunteers")) || [];

        volunteers.forEach(v => {
            const row = `
                <tr>
                    <td>${v.name}</td>
                    <td>${v.email}</td>
                    <td>${v.skills}</td>
                    <td>${v.availability}</td>
                </tr>
            `;
            volunteerTable.innerHTML += row;
        });
    }

});
