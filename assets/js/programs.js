import { supabase } from "./supabaseClient.js";

const PAGE_SIZE = 10;

const el = {
  cards: document.getElementById("cards"),
  meta: document.getElementById("meta"),
  sortBy: document.getElementById("sortBy"),

  priceMin: document.getElementById("priceMin"),
  priceMax: document.getElementById("priceMax"),
  priceMinTxt: document.getElementById("priceMinTxt"),
  priceMaxTxt: document.getElementById("priceMaxTxt"),

  durMin: document.getElementById("durMin"),
  durMax: document.getElementById("durMax"),
  durMinTxt: document.getElementById("durMinTxt"),
  durMaxTxt: document.getElementById("durMaxTxt"),

  country: document.getElementById("country"),

  uniSearch: document.getElementById("uniSearch"),
  uniList: document.getElementById("uniList"),

  groupSearch: document.getElementById("groupSearch"),
  groupList: document.getElementById("groupList"),

  apply: document.getElementById("apply"),
  reset: document.getElementById("reset"),

  prev: document.getElementById("prev"),
  next: document.getElementById("next"),

  toggleFilters: document.getElementById("toggleFilters"),
  closeFilters: document.getElementById("closeFilters"),
  filtersPanel: document.getElementById("filtersPanel"),
};

let page = 0;
let totalCount = 0;

let universities = []; // {id, name_ar}
let groups = [];       // string[]

const state = {
  country: "",
  uniIds: new Set(),
  groupSet: new Set(),
  priceMin: Number(el.priceMin.value),
  priceMax: Number(el.priceMax.value),
  durMin: Number(el.durMin.value),
  durMax: Number(el.durMax.value),
  sort: el.sortBy.value,
};

function fmtMoney(n, cur = "USD"){
  if (n === null || n === undefined) return "غير متوفر";
  const num = Number(n);
  if (!Number.isFinite(num)) return "غير متوفر";
  return `${num.toLocaleString()} ${cur}`;
}

function clampRanges(){
  let a = Number(el.priceMin.value);
  let b = Number(el.priceMax.value);
  if (a > b) [a, b] = [b, a];
  el.priceMin.value = String(a);
  el.priceMax.value = String(b);
  state.priceMin = a;
  state.priceMax = b;
  el.priceMinTxt.textContent = fmtMoney(a);
  el.priceMaxTxt.textContent = fmtMoney(b);

  let d1 = Number(el.durMin.value);
  let d2 = Number(el.durMax.value);
  if (d1 > d2) [d1, d2] = [d2, d1];
  el.durMin.value = String(d1);
  el.durMax.value = String(d2);
  state.durMin = d1;
  state.durMax = d2;
  el.durMinTxt.textContent = `${d1} سنة`;
  el.durMaxTxt.textContent = `${d2} سنة`;
}

function skeleton(){
  el.cards.innerHTML = "";
  for (let i=0;i<PAGE_SIZE;i++){
    el.cards.insertAdjacentHTML("beforeend", `
      <div class="card" style="opacity:.6">
        <div class="left">
          <div class="logo">…</div>
          <div class="info">
            <p class="title">جارٍ التحميل…</p>
            <p class="sub">—</p>
            <div class="tags">
              <span class="tag">—</span><span class="tag">—</span>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="prices">
            <div class="old">—</div>
            <div class="new">—</div>
          </div>
          <button class="btn btn-primary" disabled>سجل الآن</button>
        </div>
      </div>
    `);
  }
}

function render(rows){
  el.cards.innerHTML = "";

  if (!rows || rows.length === 0){
    el.cards.innerHTML = `<div class="card"><p class="sub">لا توجد نتائج مطابقة.</p></div>`;
    return;
  }

  for (const r of rows){
    const uni = r.university_name_ar || "جامعة";
    const program = r.program_name_ar || "برنامج";
    const city = [r.country, r.city].filter(Boolean).join(" • ");
    const degree = r.degree || "";
    const lang = r.language || "";
    const dur = r.duration_years ? `${r.duration_years} سنوات` : "—";

    const newPrice = (r.tuition_amount != null) ? fmtMoney(r.tuition_amount, r.currency) : "غير متوفر";
    const hasOld = r.original_amount != null && Number(r.original_amount) > Number(r.tuition_amount || 0);
    const oldPrice = hasOld ? fmtMoney(r.original_amount, r.currency) : "";

    const tags = [
      r.program_group || "تخصص",
      degree,
      lang,
      dur
    ].filter(Boolean);

    el.cards.insertAdjacentHTML("beforeend", `
      <div class="card">
        <div class="left">
          <div class="logo">${(uni || "U").slice(0,1)}</div>
          <div class="info">
            <p class="title">${program}</p>
            <p class="sub">${uni} • ${city}</p>
            <div class="tags">
              ${tags.map(t => `<span class="tag">${t}</span>`).join("")}
            </div>
          </div>
        </div>

        <div class="right">
          <div class="prices">
            ${hasOld ? `<div class="old">${oldPrice}</div>` : `<div class="old" style="visibility:hidden">—</div>`}
            <div class="new">${newPrice}</div>
          </div>

          <button class="btn btn-primary" onclick="window.open('${r.website_url || '#'}','_blank')">سجل الآن</button>
        </div>
      </div>
    `);
  }
}

function makeCheckboxItem({ id, label, sub, checked, onChange }) {
  const uid = `c_${Math.random().toString(16).slice(2)}`;
  const html = `
    <div class="check">
      <label for="${uid}">
        <input id="${uid}" type="checkbox" ${checked ? "checked" : ""}>
        <span>${label}</span>
      </label>
      ${sub ? `<span class="small">${sub}</span>` : ""}
    </div>
  `;
  const tmp = document.createElement("div");
  tmp.innerHTML = html.trim();
  const node = tmp.firstElementChild;
  const input = node.querySelector("input");
  input.addEventListener("change", () => onChange(input.checked));
  return node;
}

function renderUniversities(list){
  el.uniList.innerHTML = "";
  const q = (el.uniSearch.value || "").trim().toLowerCase();

  const filtered = list
    .filter(u => !q || (u.name_ar || "").toLowerCase().includes(q))
    .slice(0, 80);

  for (const u of filtered){
    el.uniList.appendChild(makeCheckboxItem({
      id: u.id,
      label: u.name_ar,
      sub: "",
      checked: state.uniIds.has(u.id),
      onChange: (checked) => {
        if (checked) state.uniIds.add(u.id);
        else state.uniIds.delete(u.id);
      }
    }));
  }
}

function renderGroups(list){
  el.groupList.innerHTML = "";
  const q = (el.groupSearch.value || "").trim().toLowerCase();

  const filtered = list
    .filter(g => !q || (g || "").toLowerCase().includes(q))
    .slice(0, 120);

  for (const g of filtered){
    el.groupList.appendChild(makeCheckboxItem({
      id: g,
      label: g,
      sub: "",
      checked: state.groupSet.has(g),
      onChange: (checked) => {
        if (checked) state.groupSet.add(g);
        else state.groupSet.delete(g);
      }
    }));
  }
}

async function loadFiltersData(){
  // countries
  {
    const { data, error } = await supabase.from("universities").select("country").limit(2000);
    if (!error){
      const uniq = [...new Set((data||[]).map(x=>x.country).filter(Boolean))].sort();
      el.country.innerHTML = `<option value="">حدد البلد</option>` + uniq.map(c => `<option value="${c}">${c}</option>`).join("");
    }
  }

  // universities
  {
    const { data, error } = await supabase.from("universities").select("id,name_ar").limit(2000);
    if (!error){
      universities = (data||[]).map(x => ({ id:x.id, name_ar:x.name_ar })).sort((a,b)=>a.name_ar.localeCompare(b.name_ar));
      renderUniversities(universities);
    }
  }

  // groups (program_group)
  {
    const { data, error } = await supabase.from("programs").select("program_group").limit(5000);
    if (!error){
      const uniq = [...new Set((data||[]).map(x=>x.program_group).filter(Boolean))].sort();
      groups = uniq;
      renderGroups(groups);
    }
  }
}

function applySort(q){
  const s = state.sort;
  if (s === "price_asc") return q.order("tuition_amount", { ascending: true });
  if (s === "price_desc") return q.order("tuition_amount", { ascending: false });
  if (s === "updated_desc") return q.order("price_updated_at", { ascending: false });
  return q;
}

async function fetchResults(){
  clampRanges();
  skeleton();

  let q = supabase
    .from("programs_latest_price")
    .select("*", { count: "exact" });

  // filters
  if (state.country) q = q.eq("country", state.country);

  if (state.uniIds.size > 0) {
    q = q.in("university_id", Array.from(state.uniIds));
  }

  if (state.groupSet.size > 0) {
    q = q.in("program_group", Array.from(state.groupSet));
  }

  // price range (exclude null prices naturally by gte/lte)
  q = q.gte("tuition_amount", state.priceMin).lte("tuition_amount", state.priceMax);

  // duration
  q = q.gte("duration_years", state.durMin).lte("duration_years", state.durMax);

  // sorting
  q = applySort(q);

  // pagination
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  q = q.range(from, to);

  const { data, error, count } = await q;
  if (error){
    el.cards.innerHTML = `<div class="card"><p class="sub">${error.message}</p></div>`;
    return;
  }

  totalCount = count || 0;
  el.meta.textContent = `عدد النتائج: ${totalCount} — الصفحة: ${page + 1}`;

  render(data || []);

  // pager buttons
  el.prev.disabled = page <= 0;
  el.next.disabled = (from + PAGE_SIZE) >= totalCount;
}

function resetAll(){
  state.country = "";
  state.uniIds.clear();
  state.groupSet.clear();

  el.country.value = "";
  el.uniSearch.value = "";
  el.groupSearch.value = "";

  el.priceMin.value = "0";
  el.priceMax.value = "50000";
  el.durMin.value = "1";
  el.durMax.value = "7";
  el.sortBy.value = "price_asc";
  state.sort = "price_asc";

  renderUniversities(universities);
  renderGroups(groups);

  page = 0;
}

function wireUI(){
  // ranges
  el.priceMin.addEventListener("input", clampRanges);
  el.priceMax.addEventListener("input", clampRanges);
  el.durMin.addEventListener("input", clampRanges);
  el.durMax.addEventListener("input", clampRanges);

  // select
  el.country.addEventListener("change", () => state.country = el.country.value);

  // searches
  el.uniSearch.addEventListener("input", () => renderUniversities(universities));
  el.groupSearch.addEventListener("input", () => renderGroups(groups));

  // sort
  el.sortBy.addEventListener("change", () => {
    state.sort = el.sortBy.value;
    page = 0;
    fetchResults();
  });

  // apply / reset
  el.apply.addEventListener("click", () => {
    page = 0;
    fetchResults();
    // close on mobile
    el.filtersPanel.classList.remove("open");
  });

  el.reset.addEventListener("click", () => {
    resetAll();
    fetchResults();
  });

  // pager
  el.prev.addEventListener("click", () => { page = Math.max(0, page - 1); fetchResults(); });
  el.next.addEventListener("click", () => { page = page + 1; fetchResults(); });

  // mobile filters
  if (el.toggleFilters){
    el.toggleFilters.addEventListener("click", () => el.filtersPanel.classList.add("open"));
  }
  if (el.closeFilters){
    el.closeFilters.addEventListener("click", () => el.filtersPanel.classList.remove("open"));
  }
  // click outside inner to close (mobile)
  el.filtersPanel.addEventListener("click", (e) => {
    if (e.target === el.filtersPanel) el.filtersPanel.classList.remove("open");
  });
}

async function init(){
  wireUI();
  clampRanges();
  await loadFiltersData();

  // Optional deep-linking from the homepage buttons
  const tab = new URLSearchParams(window.location.search).get("tab");
  if (tab === "browse"){
    // Open filters and focus university search
    el.filtersPanel?.classList.add("open");
    setTimeout(() => {
      el.filtersPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
      el.uniSearch?.focus();
    }, 80);
  } else if (tab === "search"){
    setTimeout(() => {
      el.groupSearch?.focus();
    }, 80);
  }

  await fetchResults();
}

init();
