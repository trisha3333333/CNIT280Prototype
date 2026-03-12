// LOGIN
function login() {
    const role = roleSelect.value;
    const user = username.value;
    const pass = password.value;

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

document.addEventListener("DOMContentLoaded", function() {

    loadDashboard();
    loadPendingForms();

    if (familyForm) {
        familyForm.addEventListener("submit", function(e) {
            e.preventDefault();
            let family = {
                name: familyName.value,
                email: familyEmail.value,
                phone: familyPhone.value,
                needs: familyNeeds.value
            };
            let pending = JSON.parse(localStorage.getItem("pendingForms")) || [];
            pending.push(family);
            localStorage.setItem("pendingForms", JSON.stringify(pending));
            familyForm.reset();
            alert("Submitted for approval");
        });
    }

    if (volunteerForm) {
        volunteerForm.addEventListener("submit", function(e) {
            e.preventDefault();
            let volunteer = {
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
});

function loadDashboard() {
    let familyTable = document.querySelector("#familyTable tbody");
    if (!familyTable) return;

    let families = JSON.parse(localStorage.getItem("families")) || [];
    familyTable.innerHTML = "";

    families.forEach((f, i) => {
        familyTable.innerHTML += `
        <tr>
            <td>${f.name}</td>
            <td>${f.email}</td>
            <td>${f.phone}</td>
            <td>${f.needs}</td>
            <td><button onclick="deleteFamily(${i})">Delete</button></td>
        </tr>`;
    });

    let volunteerTable = document.querySelector("#volunteerTable tbody");
    let volunteers = JSON.parse(localStorage.getItem("volunteers")) || [];
    volunteerTable.innerHTML = "";
    volunteers.forEach(v => {
        volunteerTable.innerHTML += `
        <tr>
            <td>${v.name}</td>
            <td>${v.email}</td>
            <td>${v.skills}</td>
            <td>${v.availability}</td>
        </tr>`;
    });
}

function approveSubmission(i) {
    let pending = JSON.parse(localStorage.getItem("pendingForms")) || [];
    let families = JSON.parse(localStorage.getItem("families")) || [];
    families.push(pending[i]);
    pending.splice(i, 1);
    localStorage.setItem("families", JSON.stringify(families));
    localStorage.setItem("pendingForms", JSON.stringify(pending));
    loadDashboard();
    loadPendingForms();
}

function loadPendingForms() {
    let container = document.getElementById("pendingSubmissions");
    if (!container) return;
    let pending = JSON.parse(localStorage.getItem("pendingForms")) || [];
    container.innerHTML = "";
    pending.forEach((p, i) => {
        container.innerHTML += `
        <div>
            ${p.name} - ${p.email}
            <button onclick="approveSubmission(${i})">Approve</button>
        </div>`;
    });
}

function deleteFamily(i) {
    let families = JSON.parse(localStorage.getItem("families")) || [];
    families.splice(i, 1);
    localStorage.setItem("families", JSON.stringify(families));
    loadDashboard();
}

function addOpportunity() {
    let opportunities = JSON.parse(localStorage.getItem("opportunities")) || [];
    opportunities.push({title: oppTitle.value, keyword: oppKeyword.value});
    localStorage.setItem("opportunities", JSON.stringify(opportunities));
    alert("Opportunity Added");
}

function matchFamilies() {
    let families = JSON.parse(localStorage.getItem("families")) || [];
    let opportunities = JSON.parse(localStorage.getItem("opportunities")) || [];
    let results = "";
    families.forEach(f => {
        opportunities.forEach(o => {
            if (f.needs.toLowerCase().includes(o.keyword.toLowerCase())) {
                results += `<p>${f.name} matches ${o.title}</p>`;
            }
        });
    });
    document.getElementById("matchResults").innerHTML = results;
}

function runQuery() {
    let families = JSON.parse(localStorage.getItem("families")) || [];
    let keyword = queryInput.value.toLowerCase();
    let results = "";
    families.forEach(f => {
        if (f.needs.toLowerCase().includes(keyword)) {
            results += `<p>${f.name} - ${f.email}</p>`;
        }
    });
    document.getElementById("queryResults").innerHTML = results;
}

function generateContactList() {
    let families = JSON.parse(localStorage.getItem("families")) || [];
    let list = families.map(f => `${f.name} - ${f.email} - ${f.phone}`).join("<br>");
    document.getElementById("queryResults").innerHTML = "<strong>Contact List:</strong><br>" + list;
}
