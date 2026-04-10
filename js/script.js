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

document.addEventListener("DOMContentLoaded", function () {
    loadDashboard();
    loadPendingForms();
    loadFamilyOpportunities();
    loadFamilyMatches();
    loadNewsletters();

    const familyFormElement = document.getElementById("familyForm");
    const volunteerFormElement = document.getElementById("volunteerForm");

    if (familyFormElement) {
        familyFormElement.addEventListener("submit", function (e) {
            e.preventDefault();

            let family = {
                name: document.getElementById("familyName").value,
                email: document.getElementById("familyEmail").value,
                phone: document.getElementById("familyPhone").value,
                needs: document.getElementById("familyNeeds").value,
                subscribed: document.getElementById("familySubscribed").checked
            };

            let pending = JSON.parse(localStorage.getItem("pendingForms")) || [];
            pending.push(family);
            localStorage.setItem("pendingForms", JSON.stringify(pending));

            familyFormElement.reset();
            alert("Submitted for approval");
        });
    }

    if (volunteerFormElement) {
        volunteerFormElement.addEventListener("submit", function (e) {
            e.preventDefault();

            let volunteer = {
                name: document.getElementById("volName").value,
                email: document.getElementById("volEmail").value,
                skills: document.getElementById("volSkills").value,
                availability: document.getElementById("volAvailability").value
            };

            let volunteers = JSON.parse(localStorage.getItem("volunteers")) || [];
            volunteers.push(volunteer);
            localStorage.setItem("volunteers", JSON.stringify(volunteers));

            volunteerFormElement.reset();
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
            <td>${f.subscribed ? "Yes" : "No"}</td>
            <td><button onclick="deleteFamily(${i})" class="btn-secondary">Delete</button></td>
        </tr>`;
    });

    let volunteerTable = document.querySelector("#volunteerTable tbody");
    if (!volunteerTable) return;

    let volunteers = JSON.parse(localStorage.getItem("volunteers")) || [];
    volunteerTable.innerHTML = "";

    volunteers.forEach((v) => {
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
        <div style="margin-bottom:10px;">
            ${p.name} - ${p.email}
            <button onclick="approveSubmission(${i})" class="btn-primary">Approve</button>
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
    let titleInput = document.getElementById("oppTitle");
    let keywordInput = document.getElementById("oppKeyword");

    let title = titleInput.value.trim();
    let keyword = keywordInput.value.trim();

    if (title === "" || keyword === "") {
        alert("Please enter both title and keyword.");
        return;
    }

    let opportunities = JSON.parse(localStorage.getItem("opportunities")) || [];
    opportunities.push({ title: title, keyword: keyword });
    localStorage.setItem("opportunities", JSON.stringify(opportunities));

    titleInput.value = "";
    keywordInput.value = "";

    alert("Opportunity Added");
}

function matchFamilies() {
    let families = JSON.parse(localStorage.getItem("families")) || [];
    let opportunities = JSON.parse(localStorage.getItem("opportunities")) || [];
    let results = "";

    families.forEach(f => {
        let familyMatched = false;

        opportunities.forEach(o => {
            if (f.needs.toLowerCase().includes(o.keyword.toLowerCase())) {
                results += `<p>${f.name} matches ${o.title}</p>`;
                familyMatched = true;
            }
        });

        if (!familyMatched) {
            results += `<p>${f.name} has no current matches.</p>`;
        }
    });

    document.getElementById("matchResults").innerHTML = results;
}

function runQuery() {
    let families = JSON.parse(localStorage.getItem("families")) || [];
    let keyword = document.getElementById("queryInput").value.toLowerCase();
    let results = "";

    families.forEach(f => {
        if (f.needs.toLowerCase().includes(keyword)) {
            results += `<p>${f.name} - ${f.email}</p>`;
        }
    });

    document.getElementById("queryResults").innerHTML = results || "<p>No results found.</p>";
}

function generateContactList() {
    let families = JSON.parse(localStorage.getItem("families")) || [];
    let list = families.map(f => `${f.name} - ${f.email} - ${f.phone}`).join("<br>");
    document.getElementById("queryResults").innerHTML =
        "<strong>Contact List:</strong><br>" + (list || "No family records available.");
}

/* USER STORY 202 - FAMILY CAN VIEW OPPORTUNITIES */
function loadFamilyOpportunities() {
    let container = document.getElementById("allOpportunities");
    if (!container) return;

    let opportunities = JSON.parse(localStorage.getItem("opportunities")) || [];

    if (opportunities.length === 0) {
        container.innerHTML = "<p>No opportunities available yet.</p>";
        return;
    }

    let html = "";
    opportunities.forEach(o => {
        html += `
        <div class="card" style="margin-bottom:15px;">
            <h3>${o.title}</h3>
            <p>Keyword: ${o.keyword}</p>
        </div>`;
    });

    container.innerHTML = html;
}

function loadFamilyMatches() {
    let container = document.getElementById("familyMatches");
    if (!container) return;

    let pending = JSON.parse(localStorage.getItem("pendingForms")) || [];
    let families = JSON.parse(localStorage.getItem("families")) || [];
    let opportunities = JSON.parse(localStorage.getItem("opportunities")) || [];

    let allFamilies = [...families, ...pending];

    if (allFamilies.length === 0) {
        container.innerHTML = "<p>No family information submitted yet.</p>";
        return;
    }

    let latestFamily = allFamilies[allFamilies.length - 1];
    let matches = opportunities.filter(o =>
        latestFamily.needs.toLowerCase().includes(o.keyword.toLowerCase())
    );

    if (matches.length === 0) {
        container.innerHTML = "<p>No matched opportunities yet.</p>";
        return;
    }

    let html = "";
    matches.forEach(m => {
        html += `
        <div class="card" style="margin-bottom:15px;">
            <h3>${m.title}</h3>
            <p>Matched to your interests/needs.</p>
        </div>`;
    });

    container.innerHTML = html;
}

/* USER STORIES 701 and 702 - NEWSLETTER */
function sendNewsletter() {
    let title = document.getElementById("newsletterTitle").value.trim();
    let message = document.getElementById("newsletterMessage").value.trim();
    let statusBox = document.getElementById("newsletterStatus");

    if (title === "" || message === "") {
        alert("Please enter a newsletter title and message.");
        return;
    }

    let newsletters = JSON.parse(localStorage.getItem("newsletters")) || [];
    newsletters.unshift({
        title: title,
        message: message,
        date: new Date().toLocaleDateString()
    });

    localStorage.setItem("newsletters", JSON.stringify(newsletters));

    document.getElementById("newsletterTitle").value = "";
    document.getElementById("newsletterMessage").value = "";

    let families = JSON.parse(localStorage.getItem("families")) || [];
    let subscribedFamilies = families.filter(f => f.subscribed);

    statusBox.innerHTML = `<p>Newsletter sent to ${subscribedFamilies.length} subscribed family(s).</p>`;
}

function loadNewsletters() {
    let container = document.getElementById("newsletterSection");
    if (!container) return;

    let newsletters = JSON.parse(localStorage.getItem("newsletters")) || [];
    let pending = JSON.parse(localStorage.getItem("pendingForms")) || [];
    let families = JSON.parse(localStorage.getItem("families")) || [];
    let allFamilies = [...families, ...pending];

    if (allFamilies.length === 0) {
        container.innerHTML = "<p>Submit family information first to view newsletters.</p>";
        return;
    }

    let latestFamily = allFamilies[allFamilies.length - 1];

    if (!latestFamily.subscribed) {
        container.innerHTML = "<p>You are not subscribed to the newsletter.</p>";
        return;
    }

    if (newsletters.length === 0) {
        container.innerHTML = "<p>No newsletters have been sent yet.</p>";
        return;
    }

    let html = "";
    newsletters.forEach(n => {
        html += `
        <div class="card" style="margin-bottom:15px;">
            <h3>${n.title}</h3>
            <p>${n.message}</p>
            <small>Sent on: ${n.date}</small>
        </div>`;
    });

    container.innerHTML = html;
}
