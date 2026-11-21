// Load every bank / concepts / patterns file with a stub window and sanity-check structure.
// Run:  node tools/check_banks.js   (or ELECTRON_RUN_AS_NODE=1 Code.exe tools/check_banks.js)
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.resolve(__dirname, "..");
const win = {}; let bad = 0;
const err = (m) => { console.log("ERROR", m); bad++; };
for (const dir of ["qb", "concepts", "patterns"]) {
  const d = path.join(root, "assets", dir);
  if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d).filter((f) => f.endsWith(".js"))) {
    try { vm.runInNewContext(fs.readFileSync(path.join(d, f), "utf8"), { window: win, String }, { filename: f }); }
    catch (e) { err(dir + "/" + f + ": " + e.message); }
  }
}
for (const [id, b] of Object.entries(win.QB_ALL || {})) {
  (b.mcq || []).forEach((q, i) => { if (!q.a.length || q.a.some((x) => x >= q.o.length)) err(id + " mcq" + i + " bad answer index"); if (q.single && q.a.length !== 1) err(id + " mcq" + i + " single but multiple answers"); });
  const P = (win.QB_PATTERNS || {})[id];
  if (P) {
    if ((P.mcq || []).length !== (b.mcq || []).length) err(id + " pattern mcq count " + (P.mcq || []).length + " vs " + b.mcq.length);
    if ((P.short || []).length !== (b.short || []).length) err(id + " pattern short count " + (P.short || []).length + " vs " + (b.short || []).length);
    const L = b.long || [];
    if ((P.long || []).length !== L.length) err(id + " pattern long count");
    L.forEach((q, i) => { if (((P.long || [])[i] || []).length !== q.parts.length) err(id + " pattern long" + i + " parts " + (((P.long || [])[i] || []).length) + " vs " + q.parts.length); });
  }
}
for (const id of Object.keys(win.QB_CONCEPTS || {})) if (!(win.QB_CONCEPTS[id] || []).every((c) => c.h && c.b)) err(id + " concept card missing h/b");
console.log("banks", Object.keys(win.QB_ALL || {}).length, "concepts", Object.keys(win.QB_CONCEPTS || {}).length, "patterns", Object.keys(win.QB_PATTERNS || {}).length, "errors", bad);
