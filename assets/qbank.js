/* DLVA Question Bank — question rendering and scoring.
   Banks (assets/qb/Lxx.js) register into window.QB_ALL[id] = { id, title, date, lead,
   points:[...], mcq:[...], short:[...], long:[...] }.
   Question shapes:
     mcq   { pts, q, o:[options], a:[correct indices], x: explanation, single?: true, k?: style tag }
     short { pts, q, a: model answer }
     long  { pts, q: setup, parts:[{ pts, q, a }] }
   MCQ scoring follows the DS265o paper: "at least one correct option", partial marks for an
   incomplete but correct selection, nothing if any wrong option is chosen. */
(function () {
  "use strict";
  const L = "abcdefghij";

  function mathify(el) {
    if (!window.renderMathInElement) return;
    renderMathInElement(el, {
      delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }],
      macros: { "\\E": "\\mathbb{E}", "\\argmax": "\\operatorname*{arg\\,max}", "\\R": "\\mathbb{R}" },
      throwOnError: false,
    });
  }
  const round = (v) => Math.round(v * 100) / 100;

  // Score an MCQ selection: returns marks in [0, pts].
  function scoreMcq(q, sel) {
    const right = new Set(q.a);
    if (!sel.length) return 0;
    if (sel.some((i) => !right.has(i))) return 0;
    return round(q.pts * (sel.length / right.size));
  }

  /* ---------- builders ---------- */
  const kindTag = (q) => (q.k ? '<span class="qb-tag qb-kind">' + q.k + "</span>" : "");

  function mcqEl(q, n, mode, onScore) {
    const el = document.createElement("div");
    el.className = "qb-q qb-mcq";
    const kind = q.single ? "radio" : "checkbox";
    const name = "q" + Math.random().toString(36).slice(2);
    el.innerHTML =
      '<div class="qb-head"><span class="qb-n">' + n + '</span><span class="qb-pts">' + q.pts + (q.pts === 1 ? " mark" : " marks") + "</span>" +
      (q.single ? '<span class="qb-tag">single correct</span>' : '<span class="qb-tag">select all that apply</span>') + kindTag(q) + "</div>" +
      '<div class="qb-text">' + q.q + "</div>" +
      '<div class="qb-opts">' + q.o.map((o, i) =>
        '<label class="qb-opt"><input type="' + kind + '" name="' + name + '" value="' + i + '"><span class="qb-l">(' + L[i] + ")</span><span>" + o + "</span></label>").join("") + "</div>" +
      (mode === "practice" ? '<div class="qb-actions"><button class="btn qb-check" type="button">Check answer</button></div>' : "") +
      '<div class="qb-fb" hidden></div>';
    const reveal = () => {
      const sel = [...el.querySelectorAll("input:checked")].map((i) => +i.value);
      const marks = scoreMcq(q, sel);
      el.querySelectorAll(".qb-opt").forEach((lab, i) => {
        lab.querySelector("input").disabled = true;
        const isRight = q.a.includes(i), chosen = sel.includes(i);
        if (isRight) lab.classList.add("right");
        if (chosen && !isRight) lab.classList.add("wrong");
        if (isRight && !chosen) lab.classList.add("missed");
      });
      const fb = el.querySelector(".qb-fb");
      fb.hidden = false;
      const full = marks === q.pts, part = marks > 0 && !full;
      fb.innerHTML = '<div class="qb-verdict ' + (full ? "ok" : part ? "part" : "bad") + '">' +
        (full ? "Correct" : part ? "Partially correct" : sel.length ? "Incorrect" : "Not answered") +
        " · " + marks + " / " + q.pts + "</div>" +
        '<div class="qb-ans"><strong>Answer: ' + q.a.map((i) => "(" + L[i] + ")").join(", ") + ".</strong> " + (q.x || "") + "</div>";
      mathify(fb);
      el.classList.add("done", full ? "is-ok" : part ? "is-part" : "is-bad");
      const btn = el.querySelector(".qb-check"); if (btn) btn.remove();
      onScore && onScore(marks, q.pts);
      return marks;
    };
    if (mode === "practice") el.querySelector(".qb-check").addEventListener("click", () => {
      if (!el.querySelector("input:checked")) { el.querySelector(".qb-opts").classList.add("shake"); setTimeout(() => el.querySelector(".qb-opts").classList.remove("shake"), 400); return; }
      reveal();
    });
    el._reveal = reveal;
    return el;
  }

  // Written answer with model solution and self-marking.
  function writtenBlock(pts, answer, mode, onScore) {
    const box = document.createElement("div");
    box.className = "qb-written";
    box.innerHTML = '<textarea class="qb-draft" rows="3" placeholder="Write your answer here (stays on this page only), then reveal the model answer."></textarea>' +
      (mode === "practice" ? '<div class="qb-actions"><button class="btn ghost qb-show" type="button">Show model answer</button></div>' : "") +
      '<div class="qb-model" hidden><div class="qb-model-h">Model answer</div><div class="qb-model-b">' + answer + "</div>" +
      '<div class="qb-self"><span>Mark yourself:</span>' +
      [0, pts / 2, pts].map((v) => '<button type="button" class="qb-mark" data-v="' + v + '">' + v + " / " + pts + "</button>").join("") + "</div></div>";
    const show = () => {
      const m = box.querySelector(".qb-model");
      if (!m.hidden) return;
      m.hidden = false; mathify(m);
      const b = box.querySelector(".qb-show"); if (b) b.remove();
    };
    if (mode === "practice") box.querySelector(".qb-show").addEventListener("click", show);
    box.querySelectorAll(".qb-mark").forEach((b) => b.addEventListener("click", () => {
      box.querySelectorAll(".qb-mark").forEach((x) => x.classList.toggle("on", x === b));
      onScore && onScore(+b.dataset.v, pts, box);
    }));
    box._reveal = show;
    return box;
  }

  function shortEl(q, n, mode, onScore) {
    const el = document.createElement("div");
    el.className = "qb-q qb-short";
    el.innerHTML = '<div class="qb-head"><span class="qb-n">' + n + '</span><span class="qb-pts">' + q.pts + " marks</span><span class=\"qb-tag\">short answer</span>" + kindTag(q) + "</div>" +
      '<div class="qb-text">' + q.q + "</div>";
    const w = writtenBlock(q.pts, q.a, mode, onScore);
    el.appendChild(w);
    el._reveal = w._reveal;
    return el;
  }

  function longEl(q, n, mode, onScore) {
    const el = document.createElement("div");
    el.className = "qb-q qb-long";
    el.innerHTML = '<div class="qb-head"><span class="qb-n">' + n + '</span><span class="qb-pts">' + q.pts + " marks</span><span class=\"qb-tag\">long answer</span>" + kindTag(q) + "</div>" +
      '<div class="qb-text">' + q.q + "</div>";
    const reveals = [];
    q.parts.forEach((p, i) => {
      const part = document.createElement("div");
      part.className = "qb-part";
      part.innerHTML = '<div class="qb-part-q"><span class="qb-part-l">' + (q.labels ? q.labels[i] : "(" + (q.roman ? ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"][i] : L[i]) + ")") + '</span> <span class="qb-pts small">' + p.pts + (p.pts === 1 ? " mark" : " marks") + "</span> " + p.q + "</div>";
      const w = writtenBlock(p.pts, p.a, mode, onScore);
      part.appendChild(w);
      reveals.push(w._reveal);
      el.appendChild(part);
    });
    el._reveal = () => reveals.forEach((r) => r());
    return el;
  }

  /* ---------- practice page for one lecture ---------- */
  function renderLecture(root, bank) {
    const st = () => window.RL && RL.store; // site.js may load after this file
    const total = { mcq: 0, mcqMax: 0, w: 0, wMax: 0 };
    const written = new Map(); // box -> marks
    bank.mcq.forEach((q) => (total.mcqMax += q.pts));
    bank.short.forEach((q) => (total.wMax += q.pts));
    (bank.long || []).forEach((q) => (total.wMax += q.pts));

    const bar = document.createElement("div");
    bar.className = "qb-bar";
    bar.innerHTML = '<div class="qb-bar-score"></div><div class="qb-filter">' +
      ["All", "MCQ", "Short", "Long"].map((f, i) => '<button type="button" data-f="' + f + '"' + (i ? "" : ' class="on"') + ">" + f + "</button>").join("") +
      '</div><button type="button" class="btn ghost qb-reset">Reset</button>';
    root.appendChild(bar);
    const paint = () => {
      const w = [...written.values()].reduce((a, b) => a + b, 0);
      const best = st() ? st().get("qbBest", {})[bank.id] : null;
      bar.querySelector(".qb-bar-score").innerHTML =
        "MCQ <strong>" + round(total.mcq) + "</strong> / " + total.mcqMax + " · Written (self-marked) <strong>" + round(w) + "</strong> / " + total.wMax +
        (best ? ' <span class="muted small">· best MCQ ' + best.mcq + " / " + best.max + "</span>" : "");
    };
    const onMcq = (m) => {
      total.mcq += m;
      const store = st(); if (store) { const all = store.get("qbBest", {}); const cur = all[bank.id]; const done = root.querySelectorAll(".qb-mcq.done").length;
        if (done === bank.mcq.length && (!cur || round(total.mcq) > cur.mcq)) { all[bank.id] = { mcq: round(total.mcq), max: total.mcqMax }; store.set("qbBest", all); } }
      paint();
    };
    const onW = (m, _p, box) => { written.set(box, m); paint(); };

    const sec = (title, cls, items, make, startN) => {
      if (!items || !items.length) return startN;
      const s = document.createElement("section");
      s.className = "qb-sec " + cls;
      s.innerHTML = '<h2 id="' + cls + '">' + title + "</h2>";
      items.forEach((q, i) => s.appendChild(make(q, startN + i, "practice", make === mcqEl ? onMcq : onW)));
      root.appendChild(s);
      return startN + items.length;
    };
    let n = 1;
    n = sec("Multiple choice questions", "sec-mcq", bank.mcq, mcqEl, n);
    n = sec("Short questions", "sec-short", bank.short, shortEl, n);
    sec("Long questions", "sec-long", bank.long, longEl, n);

    bar.querySelector(".qb-filter").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      bar.querySelectorAll(".qb-filter button").forEach((x) => x.classList.toggle("on", x === b));
      const f = b.dataset.f;
      root.querySelectorAll(".qb-sec").forEach((s) => {
        s.hidden = !(f === "All" || (f === "MCQ" && s.classList.contains("sec-mcq")) || (f === "Short" && s.classList.contains("sec-short")) || (f === "Long" && s.classList.contains("sec-long")));
      });
    });
    bar.querySelector(".qb-reset").addEventListener("click", () => { root.innerHTML = ""; renderLecture(root, bank); });
    paint();
    mathify(root);
  }

  function renderPoints(el, bank) {
    if (!el || !bank.points) return;
    el.innerHTML = "<ul>" + bank.points.map((p) => "<li>" + p + "</li>").join("") + "</ul>";
    mathify(el);
  }

  window.QBR = { mcqEl, shortEl, longEl, scoreMcq, renderLecture, renderPoints, mathify };

  // Render before site.js builds the sidebar table of contents (it reads the h2s);
  // site.js then typesets all maths on the page.
  function boot() {
    const root = document.getElementById("qbank");
    const id = document.body.dataset.page;
    const bank = window.QB_ALL && window.QB_ALL[id];
    if (!root || !bank) return;
    renderPoints(document.getElementById("qb-points"), bank);
    renderLecture(root, bank);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
