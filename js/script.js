function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function setData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

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
    localStorage.removeItem("role");
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", function () {
    seedDefaultSiteContent();
    loadDashboard();
    loadPendingForms();
    loadFamilyOpportunities();
    loadFamilyMatches();
    loadNewsletters();
    loadUrgentAlerts();
    loadPublicWebsite();

    const familyForm = document.getElementById("familyForm");
    const volunteerForm = document.getElementById("volunteerForm");

    if (familyForm) {
        familyForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const family = {
                id: Date.now(),
                name: document.getElementById("familyName").value,
                email: document.getElementById("familyEmail").value,
                phone: document.getElementById("familyPhone").value,
                needs: document.getElementById("familyNeeds").value,
                subscribed: document.getElementById("familySubscribed").checked
            };

            const pending = getData("pendingForms");
            pending.push(family);
            setData("pendingForms", pending);

            localStorage.setItem("activeFamilyEmail", family.email);
            familyForm.reset();
            alert("Submitted for approval");
            loadFamilyMatches();
            loadNewsletters();
            loadUrgentAlerts();
        });
    }

    if (volunteerForm) {
        volunteerForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const volunteer = {
                id: Date.now(),
                name: document.getElementById("volName").value,
                email: document.getElementById("volEmail").value,
                skills: document.getElementById("volSkills").value,
                availability: document.getElementById("volAvailability").value
            };

            const volunteers = getData("volunteers");
            volunteers.push(volunteer);
            setData("volunteers", volunteers);

            volunteerForm.reset();
            alert("Volunteer Registered");
            loadDashboard();
        });
    }
});

/* ---------- DEFAULT SITE CONTENT ---------- */
function seedDefaultSiteContent() {
    if (!localStorage.getItem("siteAbout")) {
        localStorage.setItem("siteAbout", "Whispering Hills supports families by sharing services, programs, events, and community opportunities.");
    }

    if (!localStorage.getItem("siteServices")) {
        setData("siteServices", [
            "Family support resources",
            "Volunteer opportunities",
            "Social activities",
            "Job and community programs"
        ]);
    }
}

/* ---------- EMPLOYEE DASHBOARD ---------- */
function loadDashboard() {
    loadFamiliesTable();
    loadVolunteerTable();
    loadOpportunityList();
}

function loadFamiliesTable() {
    const familyTable = document.querySelector("#familyTable tbody");
    if (!familyTable) return;

    const families = getData("families");
    familyTable.innerHTML = "";

    if (families.length === 0) {
        familyTable.innerHTML = `<tr><td colspan="6" style="color:var(--ink-light);text-align:center;padding:24px;">No registered families yet.</td></tr>`;
        return;
    }

    families.forEach((f, i) => {
        familyTable.innerHTML += `
        <tr>
            <td><strong>${f.name}</strong></td>
            <td>${f.email}</td>
            <td>${f.phone}</td>
            <td>${f.needs}</td>
            <td><span style="color:${f.subscribed ? 'var(--sage)' : 'var(--ink-light)'};font-weight:600;">${f.subscribed ? "✓ Yes" : "No"}</span></td>
            <td>
                <button class="btn-secondary" onclick="editFamily(${i})">Edit</button>
                <button class="btn-danger" onclick="deleteFamily(${i})">Delete</button>
            </td>
        </tr>`;
    });
}

function loadVolunteerTable() {
    const volunteerTable = document.querySelector("#volunteerTable tbody");
    if (!volunteerTable) return;

    const volunteers = getData("volunteers");
    volunteerTable.innerHTML = "";

    if (volunteers.length === 0) {
        volunteerTable.innerHTML = `<tr><td colspan="5" style="color:var(--ink-light);text-align:center;padding:24px;">No registered volunteers yet.</td></tr>`;
        return;
    }

    volunteers.forEach((v, i) => {
        volunteerTable.innerHTML += `
        <tr>
            <td><strong>${v.name}</strong></td>
            <td>${v.email}</td>
            <td>${v.skills}</td>
            <td>${v.availability}</td>
            <td>
                <button class="btn-secondary" onclick="editVolunteer(${i})">Edit</button>
                <button class="btn-danger" onclick="deleteVolunteer(${i})">Delete</button>
            </td>
        </tr>`;
    });
}

function loadOpportunityList() {
    const container = document.getElementById("opportunityList");
    if (!container) return;

    const opportunities = getData("opportunities");
    container.innerHTML = "";

    if (opportunities.length === 0) {
        container.innerHTML = "<p style='color:var(--ink-light);'>No opportunities added yet.</p>";
        return;
    }

    opportunities.forEach((o, i) => {
        container.innerHTML += `
        <div class="item-box">
            <span class="opp-badge">${o.type}</span>
            <strong style="display:block;font-size:16px;margin-bottom:4px;">${o.title}</strong>
            <p style="color:var(--ink-light);font-size:14px;margin-bottom:8px;">Keyword: <em>${o.keyword}</em></p>
            <p style="font-size:14px;">${o.description}</p>
            <div style="margin-top:12px;">
                <button class="btn-secondary" onclick="editOpportunity(${i})">Edit</button>
                <button class="btn-danger" onclick="deleteOpportunity(${i})">Delete</button>
            </div>
        </div>`;
    });
}

function addOpportunity() {
    const title = document.getElementById("oppTitle").value.trim();
    const type = document.getElementById("oppType").value.trim();
    const keyword = document.getElementById("oppKeyword").value.trim();
    const description = document.getElementById("oppDescription").value.trim();

    if (!title || !type || !keyword || !description) {
        alert("Please fill in all opportunity fields.");
        return;
    }

    const opportunities = getData("opportunities");
    opportunities.push({ id: Date.now(), title, type, keyword, description });
    setData("opportunities", opportunities);

    document.getElementById("oppTitle").value = "";
    document.getElementById("oppType").value = "";
    document.getElementById("oppKeyword").value = "";
    document.getElementById("oppDescription").value = "";

    loadOpportunityList();
    loadFamilyOpportunities();
    loadFamilyMatches();
    loadPublicWebsite();
    alert("Opportunity added.");
}

function editFamily(index) {
    const families = getData("families");
    const family = families[index];

    const newName = prompt("Edit family name:", family.name);
    if (newName === null) return;
    const newEmail = prompt("Edit family email:", family.email);
    if (newEmail === null) return;
    const newPhone = prompt("Edit family phone:", family.phone);
    if (newPhone === null) return;
    const newNeeds = prompt("Edit family needs/interests:", family.needs);
    if (newNeeds === null) return;

    family.name = newName.trim();
    family.email = newEmail.trim();
    family.phone = newPhone.trim();
    family.needs = newNeeds.trim();

    families[index] = family;
    setData("families", families);
    loadFamiliesTable();
    loadFamilyMatches();
}

function deleteFamily(index) {
    if (!confirm("Delete this family record?")) return;
    const families = getData("families");
    families.splice(index, 1);
    setData("families", families);
    loadFamiliesTable();
    loadFamilyMatches();
}

function editVolunteer(index) {
    const volunteers = getData("volunteers");
    const volunteer = volunteers[index];

    const newName = prompt("Edit volunteer name:", volunteer.name);
    if (newName === null) return;
    const newEmail = prompt("Edit volunteer email:", volunteer.email);
    if (newEmail === null) return;
    const newSkills = prompt("Edit volunteer skills:", volunteer.skills);
    if (newSkills === null) return;
    const newAvailability = prompt("Edit volunteer availability:", volunteer.availability);
    if (newAvailability === null) return;

    volunteer.name = newName.trim();
    volunteer.email = newEmail.trim();
    volunteer.skills = newSkills.trim();
    volunteer.availability = newAvailability.trim();

    volunteers[index] = volunteer;
    setData("volunteers", volunteers);
    loadVolunteerTable();
}

function deleteVolunteer(index) {
    if (!confirm("Delete this volunteer?")) return;
    const volunteers = getData("volunteers");
    volunteers.splice(index, 1);
    setData("volunteers", volunteers);
    loadVolunteerTable();
}

function editOpportunity(index) {
    const opportunities = getData("opportunities");
    const opp = opportunities[index];

    const newTitle = prompt("Edit opportunity title:", opp.title);
    if (newTitle === null) return;
    const newType = prompt("Edit opportunity type:", opp.type);
    if (newType === null) return;
    const newKeyword = prompt("Edit keyword:", opp.keyword);
    if (newKeyword === null) return;
    const newDescription = prompt("Edit description:", opp.description);
    if (newDescription === null) return;

    opp.title = newTitle.trim();
    opp.type = newType.trim();
    opp.keyword = newKeyword.trim();
    opp.description = newDescription.trim();

    opportunities[index] = opp;
    setData("opportunities", opportunities);
    loadOpportunityList();
    loadFamilyOpportunities();
    loadFamilyMatches();
    loadPublicWebsite();
}

function deleteOpportunity(index) {
    if (!confirm("Delete this opportunity?")) return;
    const opportunities = getData("opportunities");
    opportunities.splice(index, 1);
    setData("opportunities", opportunities);
    loadOpportunityList();
    loadFamilyOpportunities();
    loadFamilyMatches();
    loadPublicWebsite();
}

/* ---------- PENDING APPROVALS ---------- */
function loadPendingForms() {
    const container = document.getElementById("pendingSubmissions");
    if (!container) return;

    const pending = getData("pendingForms");
    container.innerHTML = "";

    if (pending.length === 0) {
        container.innerHTML = "<p style='color:var(--ink-light);'>No pending submissions.</p>";
        return;
    }

    pending.forEach((p, i) => {
        container.innerHTML += `
        <div class="item-box">
            <strong style="font-size:16px;">${p.name}</strong>
            <p style="color:var(--ink-light);font-size:13px;margin:4px 0 2px;">${p.email} · ${p.phone}</p>
            <p style="font-size:14px;margin-bottom:4px;"><strong>Needs:</strong> ${p.needs}</p>
            <p style="font-size:14px;margin-bottom:14px;"><strong>Newsletter:</strong> ${p.subscribed ? "✓ Subscribed" : "Not subscribed"}</p>
            <button class="btn-primary" onclick="approveSubmission(${i})">Approve</button>
            <button class="btn-danger" onclick="rejectSubmission(${i})" style="margin-left:8px;">Reject</button>
        </div>`;
    });
}

function approveSubmission(index) {
    const pending = getData("pendingForms");
    const families = getData("families");

    families.push(pending[index]);
    setData("families", families);

    pending.splice(index, 1);
    setData("pendingForms", pending);

    loadPendingForms();
    loadFamiliesTable();
}

function rejectSubmission(index) {
    const pending = getData("pendingForms");
    pending.splice(index, 1);
    setData("pendingForms", pending);
    loadPendingForms();
}

/* ---------- MATCHING ---------- */
function matchFamilies() {
    const families = getData("families");
    const opportunities = getData("opportunities");
    const resultsBox = document.getElementById("matchResults");
    if (!resultsBox) return;

    let results = "";

    if (families.length === 0) {
        resultsBox.innerHTML = "<p style='color:var(--ink-light);margin-top:12px;'>No family records available to match.</p>";
        return;
    }

    families.forEach(family => {
        const matches = opportunities.filter(opp =>
            family.needs.toLowerCase().includes(opp.keyword.toLowerCase())
        );

        results += `<div class="item-box" style="margin-top:12px;">
            <strong style="font-size:15px;">👨‍👩‍👧 ${family.name}</strong><br>`;
        if (matches.length > 0) {
            matches.forEach(m => {
                results += `<span class="opp-badge" style="margin-top:8px;">${m.type}</span> <span style="font-size:14px;">${m.title}</span><br>`;
            });
        } else {
            results += `<span style="color:var(--ink-light);font-size:14px;">No matches found for current needs.</span>`;
        }
        results += `</div>`;
    });

    resultsBox.innerHTML = results;
}

/* ---------- QUERY TOOL ---------- */
function runQuery() {
    const keyword = document.getElementById("queryInput").value.trim().toLowerCase();
    const families = getData("families");
    const resultsBox = document.getElementById("queryResults");
    if (!resultsBox) return;

    const matches = families.filter(f =>
        f.needs.toLowerCase().includes(keyword) ||
        f.name.toLowerCase().includes(keyword)
    );

    if (matches.length === 0) {
        resultsBox.innerHTML = "<p style='color:var(--ink-light);margin-top:12px;'>No matching families found.</p>";
        return;
    }

    let html = "";
    matches.forEach(f => {
        html += `
        <div class="item-box" style="margin-top:12px;">
            <strong>${f.name}</strong>
            <p style="font-size:14px;color:var(--ink-light);">${f.email} · ${f.phone}</p>
            <p style="font-size:14px;">Needs: ${f.needs}</p>
        </div>`;
    });

    resultsBox.innerHTML = html;
}

function generateContactList() {
    const families = getData("families");
    const resultsBox = document.getElementById("queryResults");
    if (!resultsBox) return;

    if (families.length === 0) {
        resultsBox.innerHTML = "<p style='color:var(--ink-light);margin-top:12px;'>No families available.</p>";
        return;
    }

    let html = `<div class="item-box" style="margin-top:12px;"><strong style="font-size:15px;">📋 Contact List</strong><br><br>`;
    families.forEach(f => {
        html += `<p style="font-size:14px;padding:6px 0;border-bottom:1px solid var(--border);">${f.name} &mdash; ${f.email} &mdash; ${f.phone}</p>`;
    });
    html += "</div>";

    resultsBox.innerHTML = html;
}

/* ---------- NEWSLETTER ---------- */
function sendNewsletter() {
    const title = document.getElementById("newsletterTitle").value.trim();
    const message = document.getElementById("newsletterMessage").value.trim();
    const status = document.getElementById("newsletterStatus");

    if (!title || !message) {
        alert("Please enter newsletter title and message.");
        return;
    }

    const newsletters = getData("newsletters");
    newsletters.unshift({
        id: Date.now(),
        title,
        message,
        date: new Date().toLocaleDateString()
    });
    setData("newsletters", newsletters);

    document.getElementById("newsletterTitle").value = "";
    document.getElementById("newsletterMessage").value = "";

    const subscribedFamilies = getData("families").filter(f => f.subscribed);
    status.innerHTML = `<p>✓ Newsletter sent to ${subscribedFamilies.length} subscribed family(s).</p>`;
    loadNewsletters();
}

function loadNewsletters() {
    const container = document.getElementById("newsletterSection");
    if (!container) return;

    const newsletters = getData("newsletters");
    const activeEmail = localStorage.getItem("activeFamilyEmail");
    const families = getData("families");
    const pending = getData("pendingForms");

    const currentFamily = families.find(f => f.email === activeEmail) || pending.find(f => f.email === activeEmail);

    if (!currentFamily) {
        container.innerHTML = "<p style='color:var(--ink-light);'>Submit your family information to view newsletters.</p>";
        return;
    }

    if (!currentFamily.subscribed) {
        container.innerHTML = "<p style='color:var(--ink-light);'>You are not subscribed to weekly newsletters.</p>";
        return;
    }

    if (newsletters.length === 0) {
        container.innerHTML = "<p style='color:var(--ink-light);'>No newsletters have been sent yet.</p>";
        return;
    }

    let html = "";
    newsletters.forEach(n => {
        html += `
        <div class="item-box newsletter-item">
            <strong style="font-size:16px;">${n.title}</strong>
            <p style="font-size:14px;margin:8px 0;">${n.message}</p>
            <small style="color:var(--ink-light);">Sent on ${n.date}</small>
        </div>`;
    });

    container.innerHTML = html;
}

/* ---------- URGENT ALERTS ---------- */
function sendUrgentAlert() {
    const title = document.getElementById("alertTitle").value.trim();
    const message = document.getElementById("alertMessage").value.trim();
    const status = document.getElementById("alertStatus");

    if (!title || !message) {
        alert("Please enter alert title and message.");
        return;
    }

    const alerts = getData("alerts");
    alerts.unshift({
        id: Date.now(),
        title,
        message,
        date: new Date().toLocaleString()
    });
    setData("alerts", alerts);

    document.getElementById("alertTitle").value = "";
    document.getElementById("alertMessage").value = "";

    const familyCount = getData("families").length;
    status.innerHTML = `<p>✓ Urgent alert sent to ${familyCount} family record(s).</p>`;
    loadUrgentAlerts();
}

function loadUrgentAlerts() {
    const container = document.getElementById("alertSection");
    if (!container) return;

    const alerts = getData("alerts");

    if (alerts.length === 0) {
        container.innerHTML = "<p style='color:var(--ink-light);'>No urgent alerts right now.</p>";
        return;
    }

    let html = "";
    alerts.forEach(a => {
        html += `
        <div class="item-box alert-item">
            <strong style="font-size:16px;">🚨 ${a.title}</strong>
            <p style="font-size:14px;margin:8px 0;">${a.message}</p>
            <small style="color:var(--ink-light);">${a.date}</small>
        </div>`;
    });

    container.innerHTML = html;
}

/* ---------- FAMILY OPPORTUNITIES ---------- */
function loadFamilyOpportunities() {
    const container = document.getElementById("allOpportunities");
    if (!container) return;

    const opportunities = getData("opportunities");

    if (opportunities.length === 0) {
        container.innerHTML = "<p style='color:var(--ink-light);'>No opportunities available yet.</p>";
        return;
    }

    let html = "";
    opportunities.forEach(o => {
        html += `
        <div class="item-box">
            <span class="opp-badge">${o.type}</span>
            <strong style="display:block;font-size:16px;margin:6px 0 4px;">${o.title}</strong>
            <p style="font-size:14px;color:var(--ink-light);">${o.description}</p>
        </div>`;
    });

    container.innerHTML = html;
}

function loadFamilyMatches() {
    const container = document.getElementById("familyMatches");
    if (!container) return;

    const activeEmail = localStorage.getItem("activeFamilyEmail");
    const families = getData("families");
    const pending = getData("pendingForms");
    const opportunities = getData("opportunities");

    const currentFamily = families.find(f => f.email === activeEmail) || pending.find(f => f.email === activeEmail);

    if (!currentFamily) {
        container.innerHTML = "<p style='color:var(--ink-light);'>Submit your information to see matched opportunities.</p>";
        return;
    }

    const matches = opportunities.filter(o =>
        currentFamily.needs.toLowerCase().includes(o.keyword.toLowerCase())
    );

    if (matches.length === 0) {
        container.innerHTML = "<p style='color:var(--ink-light);'>No matched opportunities yet. Try adding more details to your needs.</p>";
        return;
    }

    let html = "";
    matches.forEach(m => {
        html += `
        <div class="item-box" style="border-left:4px solid var(--sage);">
            <span class="opp-badge">${m.type}</span>
            <strong style="display:block;font-size:16px;margin:6px 0 4px;">${m.title}</strong>
            <p style="font-size:14px;color:var(--ink-light);">${m.description}</p>
        </div>`;
    });

    container.innerHTML = html;
}

/* ---------- PUBLIC WEBSITE ---------- */
function updateWebsiteContent() {
    const about = document.getElementById("siteAbout").value.trim();
    const servicesText = document.getElementById("siteServices").value.trim();
    const status = document.getElementById("siteStatus");

    if (!about || !servicesText) {
        alert("Please fill in both website fields.");
        return;
    }

    const services = servicesText.split(",").map(item => item.trim()).filter(item => item !== "");

    localStorage.setItem("siteAbout", about);
    setData("siteServices", services);

    document.getElementById("siteAbout").value = "";
    document.getElementById("siteServices").value = "";

    status.innerHTML = "<p>✓ Website content updated successfully.</p>";
    loadPublicWebsite();
}

function loadPublicWebsite() {
    const aboutText = document.getElementById("publicAboutText");
    const servicesBox = document.getElementById("publicServices");
    const opportunitiesBox = document.getElementById("publicOpportunities");

    const siteAbout = localStorage.getItem("siteAbout");
    const services = getData("siteServices");
    const opportunities = getData("opportunities");

    if (aboutText) {
        aboutText.textContent = siteAbout || "";
    }

    if (servicesBox) {
        if (services.length === 0) {
            servicesBox.innerHTML = "<p style='color:var(--ink-light);'>No services listed yet.</p>";
        } else {
            servicesBox.innerHTML = services.map(s => `
                <div class="feature-card">
                    <div class="feature-icon icon-green">✓</div>
                    <p style="font-size:15px;font-weight:500;margin-top:12px;">${s}</p>
                </div>`).join("");
        }
    }

    if (opportunitiesBox) {
        if (opportunities.length === 0) {
            opportunitiesBox.innerHTML = "<p style='color:var(--ink-light);'>No public opportunities posted yet.</p>";
        } else {
            opportunitiesBox.innerHTML = opportunities.map(o => `
                <div class="feature-card">
                    <span class="opp-badge">${o.type}</span>
                    <h3 style="margin:10px 0 8px;font-size:18px;">${o.title}</h3>
                    <p>${o.description}</p>
                </div>`).join("");
        }
    }
}
