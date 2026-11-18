# Research mission: layout of the catch-all library pages (Java / JavaScript / Python)

**Status:** research brief + baseline findings. **No implementation done yet** (implementation is in
scope for the follow-up phase of the same mission).

**Pages in scope**

- `docs/els-for-libraries/javascript-libraries/README.md`
- `docs/els-for-libraries/java-libraries/README.md`
- `docs/els-for-libraries/python-libraries/README.md`

Secondary (same data, different surface): `docs/.vuepress/components/ELSTechnology.vue`, which
renders the supported-library list on `/els-for-libraries/`.

---

## 1. Mission

**Goal.** Decide how the catch-all library pages should present a few hundred packages and their
supported versions, so that a reader can find one package in seconds, and so that a writer can add
a release without touching two hand-maintained copies of the same data. Then implement the decision.

**Why it is a mission and not a one-line fix.** The page is a flat bullet list that grew past the
point where a flat bullet list works (301 entries / 1,277 version numbers on the JavaScript page),
and the same data already exists in a second place that has started to drift. Picking a layout
without deciding where the data lives would lock in the drift.

**In scope**

1. Measure the current state (done — section 2).
2. Benchmark the presentation options against explicit criteria (section 4-5).
3. Pick one, agree it with the ELS docs owner, and add it to the Style Guide as the pattern for
   catch-all pages.
4. **Implement** it on all three pages + the landing-page widget, in phases (section 7).

**Out of scope**

- Per-library pages (`django`, `spring`, `lodash`, …) — they stay as they are.
- The `spring` page's per-module `TableTabs` — already a working pattern for its shape of data.
- Anything about where TuxCare publishes CVE data (CVE Tracker owns that; see ELSDOC-466).

**Done when**

- One layout decided, written into the Style Guide (page type: catch-all / ecosystem list page).
- The three pages render it.
- Adding a released version is a single edit in a single place, and the landing widget picks it up
  without a second manual edit.

---

## 2. Baseline (measured 2026-10-28, `master` @ 72db8b5)

### 2.1 Size

| Page | Package entries | Version numbers listed | Max versions on one line | Median | File |
|---|---:|---:|---:|---:|---:|
| javascript-libraries | 301 | 1,277 | 41 (`dompurify`) | 2 | 19.1 KB / 423 lines |
| java-libraries | 123 | 460 | 30 (`Netty`) | 2 | 13.4 KB / 341 lines |
| python-libraries | 59 | 123 | 9 (`cryptography`) | 1 | 5.9 KB / 156 lines |

Shape of the data: a long tail of single-version entries (125 of 301 on JS, 48 of 123 on Java,
34 of 59 on Python) plus a handful of entries with 20-41 comma-separated versions on one line.
Any layout has to survive both extremes.

The whole list sits under a single `##` heading, so the page has exactly four anchors
(`#supported-javascript-libraries`, `#installation`, `#what-s-next`, …) and no in-page navigation.
A reader who wants `axios` scrolls or uses Ctrl+F; there is no index, no grouping, no filter.

### 2.2 The data exists twice, and the copies disagree

`ELSTechnology.vue` (3,840 lines, hardcoded) carries the same package→versions pairs for the
landing page, with `link` pointing back at the catch-all page. Comparing the two copies today:

| Ecosystem | On the page | In the widget | Only on page | Only in widget | Version mismatches |
|---|---:|---:|---|---|---|
| JavaScript | 301 | 289 | 19 (incl. `apollo-server`, `base-x`, 5× `nestjs-*`, `jspdf`, `jsonpath`) | 6 (`Quill`, `Rollup`, `UAParser.js`, `CryptoJS`, `JSONPath Plus`, `jsPDF`) | `socket.io` (page has 3.1.1, widget does not) |
| Java | 123 | 122 | 4 (`Maven`, `Testcontainers`, `docker-java`, `jFairy`) | 2 (`Apache Maven`, `Apache Maven Shared Utils`) | — |
| Python | 59 | 58 | 1 (`transformers`) | 0 | — |

Part of that gap is naming convention rather than missing data (`crypto-js` vs `CryptoJS`,
`jspdf` vs `jsPDF`, `jsonpath-plus` vs `JSONPath Plus`) — which is itself a finding: there is no
canonical package name, so the two surfaces cannot even be diffed automatically today.
The rest is real drift: `Quill`, `Rollup` and `UAParser.js` are advertised on the landing page and
absent from the page they link to; `apollo-server` and the five `nestjs-*` packages are the reverse.

### 2.3 Why it drifts: the edit cadence

Last 12 months of commits touching these files:

- `javascript-libraries/README.md` — 48 commits; **11 of them did not touch `ELSTechnology.vue`**.
- `java-libraries/README.md` — 42 commits.
- `python-libraries/README.md` — 16 commits.
- `ELSTechnology.vue` — 71 commits.

In Jira this is the near-daily `Docs list the ELS releases of <date>` series (ELSDOC-480, -478,
-477, -472, -471, -469, -468, …), plus periodic catch-up tickets when the two copies fall behind
(ELSDOC-453 "October 2026 drift backlog", ELSDOC-460, ELSDOC-450). Every one of those edits is a
hand-written bullet in a 300-item list and a hand-written object in a 3,840-line `.vue` file.

### 2.4 Three different presentations for the same kind of content

| Page | Presentation |
|---|---|
| `java-libraries`, `javascript-libraries`, `python-libraries`, `dotnet` | flat bullet list, `**name** v, v, v` |
| `spring` | `<TableTabs>` with one markdown table per module group |
| `/els-for-libraries/` landing | `<ELSTechnology>` — search box + ecosystem tabs + rows |

The Style Guide already names the catch-all pages as an exception ("the catch-all pages use
`## Supported {Ecosystem} Libraries`"), but does not say how the list itself should look. That gap
is what this mission closes.

---

## 3. Constraints any option must respect

1. **Single source of truth** (Style Guide, *Structure & Retrieval*): every fact lives in exactly
   one canonical place. Two hand-maintained copies already violate this.
2. **`llms-full.txt` is generated from markdown source, not from rendered HTML.**
   `scripts/generate-llms-full.mjs` strips CamelCase component tags and `<script>` blocks and keeps
   *inner* prose. So data passed to a component **as props or as a `.vue` constant disappears from
   the AI corpus**, while markdown inside a component's slot survives. (This is why the landing
   page's technology list is not in `llms-full.txt` today.)
   → Prefer slot-based components wrapping markdown over data-in-component.
3. **Docs search is an external semantic index** (`search.cl-edu.com`, collection `tuxcare_docs`).
   What it indexes — markdown, rendered HTML, or chunks — is unverified from inside the repo
   (the host is not reachable from the CI container). A 19 KB single-heading list is a poor
   retrieval chunk either way. Prior art: ELSDOC-283 (search relevance).
4. **WCAG 2.2 AA**, enforced per PR by `.github/workflows/a11y.yml` / `yarn a11y`. A filter/tab
   widget needs the same treatment `ELSTechnology.vue` already has (labelled search input,
   `role="tablist"`, `aria-live` result count).
5. **No unverified version ever lands on a page** (Style Guide, *Writing with AI*): whatever the
   source of truth becomes, it must be fed from Nexus-verified data, not generated prose.
6. **Writer ergonomics.** The daily release ticket must stay a small, reviewable diff — a generated
   blob that rewrites 300 lines on every run is worse than what we have.
7. VuePress 2.0.0-beta.61, Vue 3, no search plugin in `config-user/plugins.ts`; existing components
   are registered from `.vuepress/components/`.

---

## 4. Options

**A. Hygiene only.** Keep bullets; enforce case-insensitive alphabetical order; add a letter index
(`A B C …`) linking to `###` sub-headings per letter.
*Pro:* hours of work, zero build changes, every anchor is a deep link. *Con:* does nothing about the
duplicate source; the page is still 19 KB of bullets.

**B. Markdown table** (`Package | Supported versions`), one per page.
*Pro:* scannable columns, stays plain markdown (good for `llms-full.txt` and for diffs). *Con:* a
41-version cell is ugly on mobile; still one long scroll; still a second copy in the widget.

**C. Grouped behind `<TableTabs>`** — tabs by first letter, or by category (HTTP, serialization,
build tooling…), each tab a markdown table.
*Pro:* reuses a component writers already know (`spring` precedent); content stays markdown in
slots, so constraint 2 holds. *Con:* tab anchors are known to lose heading linkability
(documented in `ComponentsUsage.md`); category assignment is editorial work that has to be
maintained; Ctrl+F only sees the open tab.

**D. Per-ecosystem filterable widget** — the `ELSTechnology` pattern scoped to one page
(search box + rows), on the catch-all pages too.
*Pro:* best findability; one mental model with the landing page. *Con:* if data moves into the
component, the page's content disappears from `llms-full.txt` (constraint 2) and the page becomes
a `.vue` edit for every release; Ctrl+F sees only filtered rows.

**E. One data file as the source of truth** — `docs/.vuepress/data/els-libraries.{json,yml}`
(package, ecosystem, versions, canonical name, optional per-library page link) that feeds **both**
the catch-all pages and `ELSTechnology.vue` at build time.
*Pro:* kills the drift class entirely; the daily release ticket becomes one line in one file;
enables a CI check against Nexus. *Con:* needs a build step and a presentation decision on top
(E composes with B, C or D); markdown is then generated, so `llms-full.txt` needs the generated
output committed, or the generator taught to read the data file.

**F. Delegate the list to the CVE Tracker** — keep a short intro + install steps on the page and
link the Technologies view (`tuxcare.com/cve-tracker/technologies/?ecosystem=…`, already linked
from *What's Next*, ELSDOC-466) as the full list.
*Pro:* the precedent exists — Resolved-CVE tables were removed from pages for exactly this reason;
zero docs maintenance. *Con:* takes the answer off the docs site (SEO, offline reading, AI corpus);
depends on another team's surface and its coverage/freshness; needs their sign-off.

---

## 5. Evaluation criteria (to score in the research phase)

| Criterion | How to judge it |
|---|---|
| Findability | Steps to answer "is `axios` 1.7.9 covered?" — scroll, Ctrl+F, filter, deep link |
| Scannability | Does the page read as a list of *packages*, or as a wall of version numbers? |
| Maintenance cost | Edits per released version; can the daily ticket stay a 1-line diff? |
| Drift resistance | Can the page and the landing widget disagree at all? |
| Retrieval (AI/search) | Does the content survive into `llms-full.txt` and the search index? |
| Deep-linkability | Can support link a customer straight to one package? |
| Accessibility | Keyboard + screen reader, per `yarn a11y` |
| Build/ops cost | New scripts, CI steps, review burden |
| Style Guide fit | Reuses existing components and page-type vocabulary |

---

## 6. Preliminary recommendation (to be confirmed, not yet agreed)

**E + B, with D as a progressive enhancement.**

- One data file per ecosystem as the single source of truth, generated into a **markdown table**
  inside the page (so `llms-full.txt`, diffs, Ctrl+F and deep links all keep working).
- `ELSTechnology.vue` reads the same data file instead of its hardcoded copy — the 2.2 drift table
  becomes structurally impossible.
- Optionally wrap the table in a slot-based filter component later: markdown stays in the slot,
  the widget only filters rendered rows.
- Alphabetical sections (A) are cheap and should ship first regardless of the final choice.

F is the cheapest long-term answer and should be put to the CVE Tracker owners explicitly, but it
is a product decision, not a docs decision.

---

## 7. Implementation phases (not started)

| Phase | Work | Rough size |
|---|---|---|
| 0 | Reconcile the 2.2 drift by hand; agree canonical package names | S |
| 1 | Letter index + alphabetical order on all three pages | S |
| 2 | Data file + build-time generation into the pages; CI check that generated output is committed | M |
| 3 | Point `ELSTechnology.vue` at the data file; delete the hardcoded copy | M |
| 4 | Style Guide: add the catch-all page type; update the skill/workflow for the new edit path | S |
| 5 | Optional filter widget over the generated table | M |

---

## 8. Open questions

1. Who owns the canonical package-name list — docs, or the Nexus/release side?
2. Does the CVE Tracker Technologies view already cover all three ecosystems completely? If yes,
   option F changes the calculus for phases 2-3.
3. What does `search.cl-edu.com` actually index (markdown vs rendered HTML, chunk size)? Needs the
   search owner — it decides whether a widget is safe.
4. Do we have page analytics (ELSDOC-313, GA4) for these three pages — scroll depth, in-page search,
   bounce? Real numbers would settle B vs D.
5. Is there a marketing/sales dependency on the page listing every package inline (SEO)?

---

## Appendix: how the numbers were produced

```bash
# entries / versions / size per page
python3 - <<'EOF'
import re, statistics
for page in ['java-libraries','javascript-libraries','python-libraries']:
    txt = open(f'docs/els-for-libraries/{page}/README.md').read()
    body = txt.split('## Installation')[0]
    items = re.findall(r'^\* \*\*(.+?)\*\*\s*(.*)$', body, re.M)
    counts = [len([v for v in vs.split(',') if v.strip()]) for _, vs in items]
    print(page, len(items), sum(counts), max(counts), statistics.median(counts), len(txt))
EOF

# drift vs the landing widget: parse ELSTechnology.vue `name/versions/link` triples
# and diff them against the page bullets (same regex as above).

# churn
git log --since="12 months ago" --oneline -- docs/els-for-libraries/javascript-libraries/README.md | wc -l
git log --since="12 months ago" --format=%H -- docs/els-for-libraries/javascript-libraries/README.md \
  | while read c; do git show --stat --format= $c | grep -q ELSTechnology.vue && echo both || echo page-only; done \
  | sort | uniq -c
```
