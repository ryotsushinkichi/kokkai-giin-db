const listEl = document.getElementById("member-list");
const searchInput = document.getElementById("search-input");
const houseFilter = document.getElementById("house-filter");
const resultCount = document.getElementById("result-count");
const paginationEl = document.getElementById("pagination");

const PAGE_SIZE = 30;

let members = [];
let currentPage = 1;

function getFiltered() {
  const query = searchInput.value.trim();
  const house = houseFilter.value;

  return members.filter((m) => {
    const matchesQuery =
      !query ||
      m.name.includes(query) ||
      m.party.includes(query) ||
      m.district.includes(query);
    const matchesHouse = !house || m.house === house;
    return matchesQuery && matchesHouse;
  });
}

function renderPagination(totalPages) {
  if (totalPages <= 1) {
    paginationEl.innerHTML = "";
    return;
  }

  const buttons = [];
  buttons.push(
    `<button data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""}>前へ</button>`
  );
  buttons.push(`<span class="page-status">${currentPage} / ${totalPages}ページ</span>`);
  buttons.push(
    `<button data-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""}>次へ</button>`
  );

  paginationEl.innerHTML = buttons.join("");
}

function render() {
  const filtered = getFiltered();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  currentPage = Math.min(currentPage, totalPages);

  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  resultCount.textContent = `${filtered.length}件中 ${
    filtered.length === 0 ? 0 : start + 1
  }〜${start + pageItems.length}件を表示(全${members.length}件)`;

  listEl.innerHTML = pageItems
    .map(
      (m) => `
    <div class="member-card">
      <h2>${m.name}</h2>
      <p class="member-meta">${m.house} / ${m.district}</p>
      <div class="member-tags">
        <span class="tag">${m.party}</span>
        <span class="tag">当選${m.termsElected}回</span>
      </div>
      <p class="member-profile">${m.profile}</p>
    </div>
  `
    )
    .join("");

  renderPagination(totalPages);
  window.scrollTo({ top: 0, behavior: "instant" });
}

fetch("data/members.json")
  .then((res) => res.json())
  .then((data) => {
    members = data;
    render();
  });

searchInput.addEventListener("input", () => {
  currentPage = 1;
  render();
});
houseFilter.addEventListener("change", () => {
  currentPage = 1;
  render();
});
paginationEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-page]");
  if (!btn || btn.disabled) return;
  currentPage = Number(btn.dataset.page);
  render();
});
