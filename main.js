"use strict";

/* =========================================================
   Theme toggle
   ========================================================= */
const root = document.documentElement;
document.getElementById("themeToggle").addEventListener("click", () => {
  const dark = getComputedStyle(root).colorScheme.includes("dark");
  root.dataset.theme = dark ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
});
document.getElementById("year").textContent = new Date().getFullYear();

/* =========================================================
   Data-driven sections (edit data/*.json, not this file)
   ========================================================= */
// Language → one of the earthy palette colors defined in style.css
const LANG_COLORS = { "C++": "var(--brick)", Python: "var(--slate)", Shell: "var(--moss)", NWChem: "var(--ochre)" };
const SOURCE_COLORS = { "digzyme Tech Blog": "var(--slate)", Qiita: "var(--moss)" };

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json();
}

loadJSON("data/software.json").then(repos => {
  const list = document.getElementById("repoList");
  repos.forEach(r => {
    const a = el("a", "card");
    a.href = r.url;
    a.style.setProperty("--c", LANG_COLORS[r.language] || "var(--plum)");
    const pill = el("span", "pill");
    pill.append(el("i"), r.language);
    a.append(pill, el("div", "repo-name", r.name), el("p", "repo-desc", r.description));
    list.append(a);
  });
}).catch(console.error);

loadJSON("data/writing.json").then(posts => {
  const list = document.getElementById("writingList");
  posts.forEach(p => {
    const a = el("a", "card post");
    a.href = p.url;
    a.style.setProperty("--c", SOURCE_COLORS[p.source] || "var(--plum)");
    const pill = el("span", "pill");
    pill.append(el("i"), p.source);
    const head = el("div", "post-head");
    head.append(pill);
    if (p.date) {
      const [y, m] = p.date.split("-").map(Number);
      head.append(el("span", "post-date", new Date(y, m - 1).toLocaleString("en", { month: "short", year: "numeric" })));
    }
    a.append(head, el("div", "post-title", p.title));
    list.append(a);
  });
}).catch(console.error);
