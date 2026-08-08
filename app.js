const listEl = document.getElementById("member-list");
const searchInput = document.getElementById("search-input");
const houseFilter = document.getElementById("house-filter");
const resultCount = document.getElementById("result-count");

let members = [];

function render() {
  const query = searchInput.value.trim();
  const house = houseFilter.value;

  const filtered = members.filter((m) => {
    const matchesQuery =
      !query ||
      m.name.includes(query) ||
      m.party.includes(query) ||
      m.district.includes(query);
    const matchesHouse = !house || m.house === house;
    return matchesQuery && matchesHouse;
  });

  resultCount.textContent = `${filtered.length}件表示中(全${members.length}件)`;

  listEl.innerHTML = filtered
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
}

fetch("data/members.json")
  .then((res) => res.json())
  .then((data) => {
    members = data;
    render();
  });

searchInput.addEventListener("input", render);
houseFilter.addEventListener("change", render);
