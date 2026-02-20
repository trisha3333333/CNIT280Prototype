document.addEventListener("DOMContentLoaded", function () {

    // FAMILY FORM
    const familyForm = document.getElementById("familyForm");
    if (familyForm) {
        familyForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const family = {
                name: familyName.value,
                email: familyEmail.value,
                phone: familyPhone.value,
                needs: familyNeeds.value
            };

            let families = JSON.parse(localStorage.getItem("families")) || [];
            families.push(family);
            localStorage.setItem("families", JSON.stringify(families));

            alert("Family Registered!");
            familyForm.reset();
        });
    }

    // VOLUNTEER FORM
    const volunteerForm = document.getElementById("volunteerForm");
    if (volunteerForm) {
        volunteerForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const volunteer = {
                name: volName.value,
                email: volEmail.value,
                skills: volSkills.value,
                availability: volAvailability.value
            };

            let volunteers = JSON.parse(localStorage.getItem("volunteers")) || [];
            volunteers.push(volunteer);
            localStorage.setItem("volunteers", JSON.stringify(volunteers));

            alert("Volunteer Registered!");
            volunteerForm.reset();
        });
    }

    // DISPLAY ON DASHBOARD
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
