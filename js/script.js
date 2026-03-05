// LOGIN
function login() {
    const role = document.getElementById("roleSelect").value;
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (role === "employee" && user === "admin" && pass === "admin123") {
        localStorage.setItem("role", "employee");
        window.location.href = "dashboard.html";
    }
    else if (role === "family" && user === "family" && pass === "family123") {
        localStorage.setItem("role", "family");
        window.location.href = "family.html";
    }
    else if (role === "volunteer" && user === "volunteer" && pass === "volunteer123") {
        localStorage.setItem("role", "volunteer");
        window.location.href = "volunteer.html";
    }
    else {
        alert("Invalid login");
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

// FAMILY FORM
document.addEventListener("DOMContentLoaded", function() {

    const familyForm = document.getElementById("familyForm");
    if (familyForm) {
        familyForm.addEventListener("submit", function(e) {
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

            familyForm.reset();
            alert("Family Registered");
        });
    }

    const volunteerForm = document.getElementById("volunteerForm");
    if (volunteerForm) {
        volunteerForm.addEventListener("submit", function(e) {
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

            volunteerForm.reset();
            alert("Volunteer Registered");
        });
    }

    loadDashboard();
});

// LOAD DASHBOARD
function loadDashboard() {

    const familyTable = document.querySelector("#familyTable tbody");
    if (familyTable) {
        let families = JSON.parse(localStorage.getItem("families")) || [];
        familyTable.innerHTML = "";

        families.forEach((f, index) => {
            familyTable.innerHTML += `
                <tr>
                    <td>${f.name}</td>
                    <td>${f.email}</td>
                    <td>${f.phone}</td>
                    <td>${f.needs}</td>
                    <td>
                        <button onclick="deleteFamily(${index})">Delete</button>
                    </td>
                </tr>
            `;
        });
    }

    const volunteerTable = document.querySelector("#volunteerTable tbody");
    if (volunteerTable) {
        let volunteers = JSON.parse(localStorage.getItem("volunteers")) || [];
        volunteerTable.innerHTML = "";

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
}

// DELETE FAMILY (Req 302)
function deleteFamily(index) {
    let families = JSON.parse(localStorage.getItem("families")) || [];
    families.splice(index, 1);
    localStorage.setItem("families", JSON.stringify(families));
    loadDashboard();
}

// ADD OPPORTUNITY
function addOpportunity() {
    const title = document.getElementById("oppTitle").value;
    const keyword = document.getElementById("oppKeyword").value;

    let opportunities = JSON.parse(localStorage.getItem("opportunities")) || [];
    opportunities.push({ title, keyword });
    localStorage.setItem("opportunities", JSON.stringify(opportunities));

    alert("Opportunity Added");
}

// MATCHING (Req 501 & 502)
function matchFamilies() {
    let families = JSON.parse(localStorage.getItem("families")) || [];
    let opportunities = JSON.parse(localStorage.getItem("opportunities")) || [];

    let results = "";

    families.forEach(f => {
        opportunities.forEach(o => {
            if (f.needs.toLowerCase().includes(o.keyword.toLowerCase())) {
                results += `<p>${f.name} matches with ${o.title}</p>`;
            }
        });
    });

    document.getElementById("matchResults").innerHTML = results;
}
