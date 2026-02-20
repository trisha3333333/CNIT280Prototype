document.addEventListener("DOMContentLoaded", function () {

    // FAMILY FORM
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

            document.getElementById("familySuccess").style.display = "block";
            familyForm.reset();
        });
    }

    // VOLUNTEER FORM
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

            document.getElementById("volunteerSuccess").style.display = "block";
            volunteerForm.reset();
        });
    }

    // DISPLAY DATA
    const familyTable = document.querySelector("#familyTable tbody");
    const volunteerTable = document.querySelector("#volunteerTable tbody");

    if (familyTable) {
        let families = JSON.parse(localStorage.getItem("families")) || [];
        families.forEach(f => {
            familyTable.innerHTML += `
                <tr>
                    <td>${f.name}</td>
                    <td>${f.email}</td>
                    <td>${f.phone}</td>
                    <td>${f.needs}</td>
                </tr>
            `;
        });
    }

    if (volunteerTable) {
        let volunteers = JSON.parse(localStorage.getItem("volunteers")) || [];
        volunteers.forEach(v => {
            volunteerTable.innerHTML += `
                <tr>
                    <td>${v.name}</td>
                    <td>${v.email}</td>
                    <td>${v.skills}</td>
                    <td>${v.availability}</td>
                </tr>
            `;
        });
    }

});
