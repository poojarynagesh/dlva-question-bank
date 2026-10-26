# DLVA Question Bank

Lecture-by-lecture exam practice for **DS 265o Deep Learning for Visual Analytics** (IISc, 2026), in the format of the course midterm. The questions are multi-correct MCQs with partial marking, 2-mark short answers, and multi-part long problems. Every question comes with a worked answer.

**Open it:** <https://poojarynagesh.github.io/dlva-question-bank/>. It also works offline: open `index.html`.

- **19 lecture pages.** Each has a revision summary and about 15 questions tagged *scenario*, *trap*, *compute*, *interpret* or *design*.
- **Solved sample midterm.** The 22 Sep 2026 paper with full solutions.
- **Mock paper generator.** It draws a random 30-mark, 90-minute paper from the lectures you choose, runs a timer and marks it when you submit.
- **Extras.** Search, light and dark themes, and a progress record kept in your browser.

To add a lecture, see [PLAN.md](PLAN.md). In short, write `assets/qb/Lnn.js`, add a row to `tools/make_pages.py`, then run `python tools/make_pages.py && python tools/build_index.py`.
