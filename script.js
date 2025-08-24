const form = document.getElementById("internship-form");
const list = document.getElementById("internship-list");
const filterButtons = document.querySelectorAll("#filter-buttons button");

let internships = JSON.parse(localStorage.getItem("internships")) || [];
let activeFilter = "all";

// Render the list based on filter
function renderList() {
  list.innerHTML = "";

  internships.forEach((item, index) => {
    if (!item.status) item.status = "pending";

    if (activeFilter !== "all" && item.status !== activeFilter) {
      return;
    }

    const li = document.createElement("li");

    const statusSpan = document.createElement("span");
    statusSpan.className = `status ${item.status}`;
    statusSpan.innerText = item.status.charAt(0).toUpperCase() + item.status.slice(1);
    statusSpan.style.cursor = "pointer";

    statusSpan.addEventListener("click", () => {
      const statuses = ["pending", "accepted", "rejected"];
      const currentIndex = statuses.indexOf(item.status);
      const nextIndex = (currentIndex + 1) % statuses.length;
      item.status = statuses[nextIndex];
      localStorage.setItem("internships", JSON.stringify(internships));
      renderList();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.style.marginTop = "8px";
    deleteBtn.style.backgroundColor = "#ccc";
    deleteBtn.style.border = "none";
    deleteBtn.style.padding = "5px 8px";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.style.borderRadius = "4px";
    deleteBtn.style.width = "100%";

    deleteBtn.addEventListener("click", () => {
      internships.splice(index, 1);
      localStorage.setItem("internships", JSON.stringify(internships));
      renderList();
    });

    li.innerHTML = `
      <strong>${item.company}</strong> - ${item.role} (${item.date})<br>
      ${item.notes}<br>Status: `;
    li.appendChild(statusSpan);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

// Handle form submit
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const company = document.getElementById("company").value.trim();
  const role = document.getElementById("role").value.trim();
  const date = document.getElementById("date").value;
  const notes = document.getElementById("notes").value.trim();

  if (company && role && date) {
    internships.push({
      company,
      role,
      date,
      notes,
      status: "pending"
    });

    localStorage.setItem("internships", JSON.stringify(internships));
    renderList();
    form.reset();
  }
});

// Handle filter clicks
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    activeFilter = btn.getAttribute("data-filter");

    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    renderList();
  });
});

// Initial load
renderList();
