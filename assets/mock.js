/* Mock paper generator: loads every lecture bank, assembles a 30-mark paper in the
   midterm's format (14 MCQ marks + 4 × 2-mark short + one 8-mark long), runs a timer,
   and reveals and scores everything on submit. Uses window.QBR from qbank.js. */
(function () {
  "use strict";
  const LECT = (window.DLVA_LECTURES || []).filter((l) => l.n);
  const $ = (id) => document.getElementById(id);
  const MCQ_MARKS = 14, N_SHORT = 4;
  const round = (v) => Math.round(v * 100) / 100;

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  // Load all banks once.
  const loaded = Promise.all(LECT.map((l) => new Promise((res) => {
    if (window.QB_ALL && window.QB_ALL[l.id]) return res();
    const s = document.createElement("script");
    s.src = "assets/qb/" + l.id + ".js";
    s.onload = s.onerror = () => res();
    document.head.appendChild(s);
  })));

  // Scope controls
  const scopeSel = $("mock-scope"), custom = $("mock-custom");
  custom.innerHTML = LECT.map((l) => '<label><input type="checkbox" value="' + l.id + '"' + (l.phase === "pre" ? " checked" : "") + "> L" + (+l.id.slice(1)) + " " + l.nav + "</label>").join("");
  function chosen() {
    const v = scopeSel.value;
    if (v === "custom") return [...custom.querySelectorAll("input:checked")].map((i) => i.value);
    return LECT.filter((l) => v === "all" || l.phase === v).map((l) => l.id);
  }
  function showPool() {
    custom.style.display = scopeSel.value === "custom" ? "flex" : "none";
    const ids = chosen(), c = { mcq: 0, short: 0, long: 0 };
    LECT.forEach((l) => { if (ids.includes(l.id)) { c.mcq += l.n.mcq; c.short += l.n.short; c.long += l.n.long; } });
    $("mock-pool").textContent = "Drawing from " + ids.length + " lecture" + (ids.length === 1 ? "" : "s") + ": " + c.mcq + " MCQs, " + c.short + " short and " + c.long + " long questions.";
  }
  scopeSel.addEventListener("change", showPool);
  custom.addEventListener("change", showPool);
  showPool();

  // Round-robin over lectures so the paper is spread across the syllabus.
  function pickSpread(ids, key, want, fits) {
    const buckets = shuffle(ids.slice()).map((id) => ({ id, items: shuffle(((window.QB_ALL[id] || {})[key] || []).slice()) })).filter((b) => b.items.length);
    const out = [];
    let progress = true;
    while (progress && !want(out)) {
      progress = false;
      for (const b of buckets) {
        if (want(out)) break;
        const i = b.items.findIndex((q) => fits(out, q));
        if (i >= 0) { out.push({ q: b.items.splice(i, 1)[0], lid: b.id }); progress = true; }
      }
    }
    return out;
  }

  let timer = null;
  function build() {
    const ids = chosen();
    if (!ids.length) { $("mock-pool").textContent = "Choose at least one lecture."; return; }
    const sum = (arr) => arr.reduce((a, x) => a + x.q.pts, 0);
    const mcq = pickSpread(ids, "mcq", (o) => sum(o) >= MCQ_MARKS, (o, q) => sum(o) + q.pts <= MCQ_MARKS);
    const short = pickSpread(ids, "short", (o) => o.length >= N_SHORT, () => true);
    const long = pickSpread(ids, "long", (o) => o.length >= 1, () => true);
    const total = sum(mcq) + sum(short) + sum(long);

    const root = $("mock-paper");
    root.innerHTML = "";
    if (timer) clearInterval(timer);
    const head = document.createElement("div");
    head.className = "card paper-head";
    head.innerHTML = '<h2 id="paper">DS265o: Deep Learning for Visual Analytics — Mock Paper</h2>' +
      '<p class="small">' + total + " marks · " + ($("mock-time").value === "0" ? "untimed" : $("mock-time").value + " minutes") +
      " · Lectures " + ids.map((i) => +i.slice(1)).join(", ") + "</p>" +
      '<p class="small muted">MCQs have at least one correct option unless stated; partial marks for an incomplete but correct selection, none if any wrong option is chosen.</p>';
    root.appendChild(head);

    const bar = document.createElement("div");
    bar.className = "qb-bar";
    bar.innerHTML = '<div class="qb-bar-score"><span class="mock-timer" id="mock-clock"></span></div><button class="btn" type="button" id="mock-submit">Submit paper</button>';
    root.appendChild(bar);

    const els = [], mcqMarks = new Map(), wMarks = new Map();
    let n = 1;
    const section = (title, items, make, onScore) => {
      if (!items.length) return;
      const s = document.createElement("section");
      s.className = "qb-sec";
      s.innerHTML = "<h2>" + title + " (" + sum(items) + " marks)</h2>";
      items.forEach((it) => {
        const el = make(it.q, n++, "exam", onScore(it));
        el.querySelector(".qb-head").insertAdjacentHTML("beforeend", '<a class="qb-tag" href="lectures/' + it.lid + '.html">Lecture ' + (+it.lid.slice(1)) + "</a>");
        els.push(el); s.appendChild(el);
      });
      root.appendChild(s);
    };
    section("Multiple choice questions", mcq, QBR.mcqEl, (it) => (m) => mcqMarks.set(it, m));
    section("Short questions", short, QBR.shortEl, () => (m, _p, box) => { wMarks.set(box, m); paintResult(); });
    section("Long question", long, QBR.longEl, () => (m, _p, box) => { wMarks.set(box, m); paintResult(); });

    const result = document.createElement("div");
    result.className = "mock-result";
    result.hidden = true;
    root.appendChild(result);
    const mcqMax = sum(mcq), wMax = sum(short) + sum(long);

    function paintResult() {
      if (result.hidden) return;
      const m = round([...mcqMarks.values()].reduce((a, b) => a + b, 0));
      const w = round([...wMarks.values()].reduce((a, b) => a + b, 0));
      const byL = {};
      mcq.forEach((it) => { const r = byL[it.lid] = byL[it.lid] || [0, 0]; r[0] += mcqMarks.get(it) || 0; r[1] += it.q.pts; });
      const weak = Object.keys(byL).filter((k) => byL[k][0] < byL[k][1]).map((k) => '<a href="lectures/' + k + '.html">Lecture ' + (+k.slice(1)) + "</a> (" + round(byL[k][0]) + "/" + byL[k][1] + ")");
      result.innerHTML = "<strong>Result.</strong> MCQ " + m + " / " + mcqMax + " (marked automatically) · Written " + w + " / " + wMax +
        " (mark each answer yourself against the model answer) · <strong>Total " + round(m + w) + " / " + total + "</strong>" +
        (weak.length ? '<p class="small">MCQ marks dropped in: ' + weak.join(", ") + ". Revisit those lectures.</p>" : '<p class="small">Full MCQ marks — well done.</p>');
    }
    function submit() {
      if (timer) clearInterval(timer);
      els.forEach((el) => el._reveal && el._reveal());
      bar.querySelector("#mock-submit").remove();
      result.hidden = false;
      paintResult();
      result.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    bar.querySelector("#mock-submit").addEventListener("click", () => {
      if (confirm("Submit the paper and see the answers?")) submit();
    });

    const mins = +$("mock-time").value, clock = bar.querySelector("#mock-clock");
    if (mins) {
      const end = Date.now() + mins * 60000;
      const tick = () => {
        const left = Math.max(0, end - Date.now()), s = Math.round(left / 1000);
        clock.textContent = "⏱ " + Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
        clock.classList.toggle("low", left < 10 * 60000);
        if (!left) { clock.textContent = "Time is up"; submit(); }
      };
      tick(); timer = setInterval(tick, 1000);
    } else clock.textContent = "Untimed";

    QBR.mathify(root);
    head.scrollIntoView({ behavior: "smooth" });
  }

  $("mock-go").addEventListener("click", () => {
    const b = $("mock-go");
    b.disabled = true;
    loaded.then(() => { b.disabled = false; b.textContent = "Generate a new paper"; build(); });
  });
})();
