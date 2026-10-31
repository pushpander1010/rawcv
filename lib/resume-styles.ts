/**
 * Resume paper styles — shared by the live preview and the PDF renderer so
 * what you see is exactly what you export.
 *
 * Everything is scoped under `.rcv` and sized in `em` against the paper's
 * base font-size, which lets the typography controls scale the entire
 * document without clipping the page (the old `zoom` approach overflowed A4).
 */

export const RESUME_CSS = `
.rcv {
  --ink: #14171c;
  --muted: #5f6874;
  --faint: #8a919c;
  --accent: #1f2a37;
  --rule: #dde1e7;
  --paper: #ffffff;
  --tint: #f5f6f8;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 14mm 15mm;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--rcv-font, Arial, Helvetica, sans-serif);
  font-size: var(--rcv-size, 11pt);
  line-height: var(--rcv-lh, 1.46);
  font-weight: 400;
  letter-spacing: 0.002em;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  overflow-wrap: break-word;
}
.rcv *, .rcv *::before, .rcv *::after { box-sizing: border-box; }
.rcv p { margin: 0; }
.rcv h1, .rcv h2, .rcv h3 { margin: 0; font-weight: inherit; }
.rcv ul { margin: 0; padding: 0; list-style: none; }
.rcv a { color: inherit; text-decoration: none; }
.rcv strong { font-weight: 700; }

/* ── Header ─────────────────────────────────────────────────────────────── */
.rcv-head { margin-bottom: 3mm; }
.rcv-head--center { text-align: center; padding-bottom: 4.5mm; border-bottom: 1.5px solid var(--ink); }
.rcv-head--center .rcv-contact { justify-content: center; }
.rcv-head--split { display: flex; align-items: flex-end; justify-content: space-between; gap: 8mm; padding-bottom: 3.5mm; border-bottom: 1px solid var(--rule); }
.rcv-head--split .rcv-contact { justify-content: flex-end; max-width: 88mm; }
.rcv-head--band { padding: 7mm 8mm; margin: 0 0 5mm; background: var(--ink); color: #fff; }
.rcv-head--band .rcv-name { color: #fff; }
.rcv-head--band .rcv-role { color: rgba(255,255,255,.72); }
.rcv-head--band .rcv-contact { color: rgba(255,255,255,.72); }
.rcv-head--band .rcv-sep { color: rgba(255,255,255,.34); }
.rcv-head--band .rcv-ci a { border-color: rgba(255,255,255,.25); }

.rcv-name { font-size: 2.5em; font-weight: 700; letter-spacing: -0.022em; line-height: 1.02; }
.rcv-role { margin-top: 1.8mm; font-size: .82em; font-weight: 600; letter-spacing: .17em; text-transform: uppercase; color: var(--accent); }
.rcv-contact { display: flex; flex-wrap: wrap; gap: 1.2mm 0; margin-top: 2.6mm; font-size: .78em; line-height: 1.5; color: var(--muted); }
.rcv-ci { white-space: nowrap; }
.rcv-ci a { border-bottom: .5px solid transparent; }
.rcv-ci a:hover { border-bottom-color: currentColor; }
.rcv-sep { padding: 0 2.4mm; color: #c1c7cf; }

/* ── Sections ───────────────────────────────────────────────────────────── */
.rcv-section { margin-top: 5.2mm; break-inside: auto; }
.rcv-section:first-child { margin-top: 0; }
.rcv-h {
  display: flex;
  align-items: center;
  gap: 3mm;
  margin-bottom: 3mm;
  font-size: .74em;
  font-weight: 700;
  letter-spacing: .19em;
  text-transform: uppercase;
  color: var(--accent);
  line-height: 1.2;
  break-after: avoid;
}
.rcv-h::after { content: ""; flex: 1; height: 1px; background: var(--rule); }
.rcv-h--plain::after { display: none; }
.rcv-h--underline { display: block; padding-bottom: 1.4mm; border-bottom: 1px solid var(--rule); }
.rcv-h--underline::after { display: none; }
.rcv-h--accent { color: var(--accent); }

/* ── Entries ────────────────────────────────────────────────────────────── */
.rcv-item { margin-bottom: 4mm; break-inside: avoid; page-break-inside: avoid; }
.rcv-item:last-child { margin-bottom: 0; }
.rcv-row { display: flex; align-items: baseline; justify-content: space-between; gap: 5mm; }
.rcv-row > *:first-child { min-width: 0; }
.rcv-job-title { font-size: 1.02em; font-weight: 700; line-height: 1.3; letter-spacing: -0.006em; }
.rcv-org { margin-top: .5mm; font-size: .92em; font-weight: 600; color: var(--muted); }
.rcv-org em { font-style: normal; color: var(--faint); font-weight: 400; }
.rcv-date { flex-shrink: 0; font-size: .76em; font-weight: 500; color: var(--faint); white-space: nowrap; font-variant-numeric: tabular-nums; letter-spacing: .03em; }
.rcv-desc { margin-top: 1.2mm; font-size: .95em; color: #39404a; line-height: 1.5; }

.rcv-bullets { margin-top: 1.6mm; }
.rcv-bullets li { position: relative; padding-left: 4.2mm; margin-bottom: .9mm; font-size: .95em; line-height: 1.48; color: #333a44; break-inside: avoid; }
.rcv-bullets li:last-child { margin-bottom: 0; }
.rcv-bullets li::before { content: ""; position: absolute; left: 0; top: .6em; width: 1.6mm; height: 1.6mm; border-radius: 50%; background: var(--accent); opacity: .42; }
.rcv-bullets--dash li { padding-left: 4mm; }
.rcv-bullets--dash li::before { content: "—"; top: auto; left: 0; width: auto; height: auto; background: none; border-radius: 0; color: var(--faint); opacity: 1; }
.rcv-bullets--plus li::before { content: "+"; top: auto; left: 0; width: auto; height: auto; background: none; border-radius: 0; color: var(--ink); opacity: 1; font-weight: 700; }

/* ── Education ──────────────────────────────────────────────────────────── */
.rcv-degree { font-size: .98em; font-weight: 700; line-height: 1.35; }
.rcv-school { margin-top: .3mm; font-size: .9em; color: var(--muted); }
.rcv-note { margin-top: .4mm; font-size: .82em; color: var(--faint); }

/* ── Skills / tags ──────────────────────────────────────────────────────── */
.rcv-tags { display: flex; flex-wrap: wrap; gap: 1.2mm; }
.rcv-tag { display: inline-block; padding: .5mm 2mm; border: .5px solid var(--rule); border-radius: .8mm; font-size: .8em; line-height: 1.5; color: #333a44; background: var(--tint); }
.rcv-tags--plain .rcv-tag { padding: 0; border: 0; background: none; }
.rcv-skill-line { font-size: .95em; color: #333a44; line-height: 1.55; }
.rcv-skill-line .rcv-sep { padding: 0 1.5mm; }
.rcv-inline-list { font-size: .95em; color: #333a44; line-height: 1.5; }
.rcv-inline-list .rcv-sep { padding: 0 1.6mm; }

/* ── Certifications ─────────────────────────────────────────────────────── */
.rcv-cert-list { display: grid; grid-template-columns: 1fr 1fr; gap: .8mm 6mm; }
.rcv-cert { position: relative; padding-left: 4.4mm; font-size: .88em; line-height: 1.5; color: #333a44; }
.rcv-cert::before { content: "—"; position: absolute; left: 0; color: var(--faint); }
.rcv-side .rcv-cert-list { grid-template-columns: 1fr; }

/* ── Projects ───────────────────────────────────────────────────────────── */
.rcv-proj-name { font-size: .98em; font-weight: 700; }
.rcv-tech { margin-top: .5mm; font-size: .78em; color: var(--faint); letter-spacing: .02em; }
.rcv-tech .rcv-sep { padding: 0 1.2mm; }

/* ── Languages ──────────────────────────────────────────────────────────── */
.rcv-lang { display: flex; align-items: baseline; justify-content: space-between; gap: 4mm; padding: 1mm 0; border-bottom: .5px solid var(--rule); font-size: .88em; }
.rcv-lang:last-child { border-bottom: 0; }
.rcv-lang b { font-weight: 600; }
.rcv-lang span { font-size: .82em; color: var(--muted); }

/* ── Utilities ──────────────────────────────────────────────────────────── */
.rcv-photo { display: block; width: 26mm; height: 26mm; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.rcv-avatar { display: flex; align-items: center; justify-content: center; width: 26mm; height: 26mm; border-radius: 50%; flex-shrink: 0; font-size: 1.6em; font-weight: 700; letter-spacing: .02em; }
.rcv-headline { display: flex; align-items: center; gap: 6mm; }
.rcv-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 8mm; }
.rcv-cols--wide-left { display: grid; grid-template-columns: 1.55fr 1fr; gap: 8mm; }
.rcv-muted { color: var(--muted); }

/* ═══════════════════════ CLASSIC ═══════════════════════ */
.rcv--classic { font-family: var(--rcv-font, Georgia, "Times New Roman", serif); --accent: #22201d; --rule: #c8c3b9; }
.rcv--classic .rcv-name { font-size: 2.45em; letter-spacing: .04em; text-transform: uppercase; font-weight: 700; }
.rcv--classic .rcv-role { color: #6f6659; letter-spacing: .22em; font-size: .76em; }
.rcv--classic .rcv-h { display: block; padding-bottom: 1.3mm; border-bottom: 1px solid var(--rule); letter-spacing: .2em; }
.rcv--classic .rcv-h::after { display: none; }
.rcv--classic .rcv-job-title { font-size: 1.04em; }
.rcv--classic .rcv-bullets li::before { border-radius: 0; transform: rotate(45deg); width: 1.3mm; height: 1.3mm; opacity: .5; }
.rcv--classic .rcv-tag { background: #faf8f4; border-color: #ded8cd; }

/* ═══════════════════════ MINIMAL ═══════════════════════ */
.rcv--minimal { --accent: #1c1f24; --rule: #e3e5e8; --muted: #6b7280; }
.rcv--minimal .rcv-name { font-size: 2.9em; font-weight: 300; letter-spacing: -.045em; }
.rcv--minimal .rcv-role { color: #6b7280; font-weight: 500; letter-spacing: .2em; }
.rcv--minimal .rcv-head { padding-bottom: 5mm; border-bottom: 1px solid var(--rule); }
.rcv--minimal .rcv-h { font-size: .7em; letter-spacing: .26em; color: #8a919c; }
.rcv--minimal .rcv-h::after { background: #eceef1; }
.rcv--minimal .rcv-section { margin-top: 6.5mm; }
.rcv--minimal .rcv-with-date { display: grid; grid-template-columns: 26mm 1fr; gap: 5mm; }
.rcv--minimal .rcv-date { text-align: left; padding-top: .4mm; }
.rcv--minimal .rcv-bullets li::before { width: 1.2mm; height: 1.2mm; opacity: .3; }
.rcv--minimal .rcv-tag { background: none; }
.rcv--minimal .rcv-tag:nth-child(n) { padding: .4mm 2.2mm; border-radius: 4mm; }

/* ═══════════════════════ MODERN ═══════════════════════ */
.rcv--modern { display: flex; padding: 14mm 15mm; min-height: 297mm; }
.rcv--modern .rcv-side { width: 68mm; flex-shrink: 0; padding: 15mm 7mm 14mm 9mm; background: #1d2733; color: #e8edf3; }
.rcv--modern .rcv-main { flex: 1; min-width: 0; padding: 15mm 10mm 14mm 9mm; }
.rcv--modern .rcv-name { font-size: 1.75em; color: #fff; letter-spacing: -.01em; line-height: 1.08; }
.rcv--modern .rcv-role { margin-top: 1.6mm; font-size: .7em; letter-spacing: .18em; color: #8fb6d9; }
.rcv--modern .rcv-contact { display: block; margin-top: 5mm; font-size: .76em; color: #b7c5d4; }
.rcv--modern .rcv-contact .rcv-ci { display: block; margin-bottom: 1.2mm; white-space: normal; }
.rcv--modern .rcv-sep { display: none; }
.rcv--modern .rcv-side .rcv-h { font-size: .68em; letter-spacing: .22em; color: #8fb6d9; margin-bottom: 2.6mm; }
.rcv--modern .rcv-side .rcv-h::after { background: rgba(255,255,255,.14); }
.rcv--modern .rcv-side .rcv-section { margin-top: 7mm; }
.rcv--modern .rcv-side .rcv-tag { background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.1); color: #dbe5ef; }
.rcv--modern .rcv-side .rcv-degree, .rcv--modern .rcv-side .rcv-cert { color: #e8edf3; }
.rcv--modern .rcv-side .rcv-school, .rcv--modern .rcv-side .rcv-note, .rcv--modern .rcv-side .rcv-inline-list { color: #9fb0c1; }
.rcv--modern .rcv-side .rcv-lang { border-color: rgba(255,255,255,.1); color: #dbe5ef; }
.rcv--modern .rcv-side .rcv-lang span { color: #9fb0c1; }
.rcv--modern .rcv-h { color: #1d2733; }
.rcv--modern .rcv-main .rcv-section:first-child { margin-top: 0; }
.rcv--modern .rcv-bullets li::before { background: #4d7ea8; opacity: .8; }

/* ═══════════════════════ EXECUTIVE ═══════════════════════ */
.rcv--executive { --accent: #12161c; --rule: #d8d3c7; --muted: #5f5b52; font-family: var(--rcv-font, Georgia, "Times New Roman", serif); }
.rcv--executive .rcv-head { padding: 7mm 8mm; margin: -1mm -2mm 5mm; background: #12161c; color: #fff; }
.rcv--executive .rcv-name { color: #fff; font-size: 2.3em; letter-spacing: .02em; }
.rcv--executive .rcv-role { color: #c8a96a; font-size: .74em; letter-spacing: .24em; }
.rcv--executive .rcv-contact { color: #b9b4a8; max-width: none; }
.rcv--executive .rcv-sep { color: #5b564d; }
.rcv--executive .rcv-h { display: block; padding-bottom: 1.2mm; border-bottom: 1.5px solid var(--accent); font-size: .74em; letter-spacing: .22em; }
.rcv--executive .rcv-h::after { display: none; }
.rcv--executive .rcv-tag { background: #f6f4ef; border-color: #e3ded3; }
.rcv--executive .rcv-bullets li::before { background: #c8a96a; opacity: 1; width: 1.2mm; height: 1.2mm; }

/* ═══════════════════════ CREATIVE ═══════════════════════ */
.rcv--creative { --accent: #5b3df5; --rule: #e6e2fb; --tint: #f5f2ff; }
.rcv--creative .rcv-head { display: flex; align-items: flex-start; gap: 6mm; padding-bottom: 4.5mm; border-bottom: 2px solid #5b3df5; }
.rcv--creative .rcv-head-copy { flex: 1; min-width: 0; }
.rcv--creative .rcv-name { font-size: 2.35em; letter-spacing: -.03em; }
.rcv--creative .rcv-role { color: #5b3df5; }
.rcv--creative .rcv-h { color: #5b3df5; font-size: .72em; letter-spacing: .22em; }
.rcv--creative .rcv-h::after { background: #e6e2fb; }
.rcv--creative .rcv-bullets li::before { background: #5b3df5; opacity: .6; }
.rcv--creative .rcv-tag { background: #f5f2ff; border-color: #e3dcff; color: #4430a8; }
.rcv--creative .rcv-mono { display: flex; align-items: center; justify-content: center; width: 22mm; height: 22mm; border-radius: 5mm; background: linear-gradient(145deg, #6d4bff, #4a2fe0); color: #fff; font-size: 1.5em; font-weight: 700; letter-spacing: .02em; flex-shrink: 0; }
.rcv--creative .rcv-timeline { position: relative; padding-left: 5mm; }
.rcv--creative .rcv-timeline::before { content: ""; position: absolute; left: .5mm; top: 1.5mm; bottom: 1.5mm; width: 1px; background: #e3dcff; }
.rcv--creative .rcv-timeline .rcv-item { position: relative; }
.rcv--creative .rcv-timeline .rcv-item::before { content: ""; position: absolute; left: -4.9mm; top: 1.9mm; width: 2.4mm; height: 2.4mm; border-radius: 50%; background: #fff; border: 1px solid #5b3df5; }

/* ═══════════════════════ SHARP ═══════════════════════ */
.rcv--sharp { --ink: #0a0a0a; --accent: #0a0a0a; --rule: #d4d4d4; }
.rcv--sharp .rcv-head { padding-bottom: 4mm; border-bottom: 3px solid #0a0a0a; }
.rcv--sharp .rcv-name { font-size: 2.65em; font-weight: 900; letter-spacing: -.045em; text-transform: uppercase; line-height: .95; }
.rcv--sharp .rcv-role { color: #0a0a0a; font-weight: 700; letter-spacing: .2em; }
.rcv--sharp .rcv-contact { font-family: "Courier New", monospace; font-size: .74em; letter-spacing: .02em; }
.rcv--sharp .rcv-h { font-weight: 900; font-size: .76em; letter-spacing: .24em; }
.rcv--sharp .rcv-h::before { content: ""; width: 2.4mm; height: 2.4mm; background: #0a0a0a; flex-shrink: 0; }
.rcv--sharp .rcv-h::after { display: none; }
.rcv--sharp .rcv-date { font-family: "Courier New", monospace; }
.rcv--sharp .rcv-job-title { font-weight: 900; text-transform: uppercase; letter-spacing: .02em; font-size: .98em; }
.rcv--sharp .rcv-org { color: #6b6b6b; font-weight: 700; text-transform: uppercase; font-size: .78em; letter-spacing: .12em; }
.rcv--sharp .rcv-tag { border: 1px solid #0a0a0a; background: none; border-radius: 0; font-size: .78em; font-weight: 600; }
.rcv--sharp .rcv-bullets li::before { background: none; content: "+"; width: auto; height: auto; border-radius: 0; color: #0a0a0a; font-weight: 700; opacity: 1; top: auto; }

/* ═══════════════════════ NAVY ═══════════════════════ */
.rcv--navy { display: flex; padding: 14mm 15mm; min-height: 297mm; }
.rcv--navy .rcv-side { width: 66mm; flex-shrink: 0; background: #0e2138; color: #e7eef7; padding: 15mm 7mm 14mm 9mm; }
.rcv--navy .rcv-main { flex: 1; min-width: 0; padding: 15mm 10mm 14mm 9mm; }
.rcv--navy .rcv-side .rcv-name { color: #fff; font-size: 1.85em; letter-spacing: .01em; }
.rcv--navy .rcv-side .rcv-role { color: #e5b96f; font-size: .68em; letter-spacing: .2em; }
.rcv--navy .rcv-contact { display: block; margin-top: 5mm; font-size: .75em; color: #a8bdd4; }
.rcv--navy .rcv-contact .rcv-ci { display: block; margin-bottom: 1.2mm; white-space: normal; }
.rcv--navy .rcv-sep { display: none; }
.rcv--navy .rcv-side .rcv-h { color: #e5b96f; font-size: .68em; letter-spacing: .2em; margin-bottom: 2.6mm; }
.rcv--navy .rcv-side .rcv-h::after { background: rgba(255,255,255,.12); }
.rcv--navy .rcv-side .rcv-section { margin-top: 7mm; }
.rcv--navy .rcv-side .rcv-degree, .rcv--navy .rcv-side .rcv-cert { color: #e7eef7; }
.rcv--navy .rcv-side .rcv-school, .rcv--navy .rcv-side .rcv-note, .rcv--navy .rcv-side .rcv-inline-list { color: #8fa8c1; }
.rcv--navy .rcv-side .rcv-inline-list { line-height: 1.7; }
.rcv--navy .rcv-side .rcv-tag { background: rgba(255,255,255,.05); border-color: rgba(255,255,255,.1); color: #d8e5f2; }
.rcv--navy .rcv-side .rcv-lang { color: #d8e5f2; border-color: rgba(255,255,255,.1); }
.rcv--navy .rcv-side .rcv-lang span { color: #8fa8c1; }
.rcv--navy .rcv-h { color: #0e2138; }
.rcv--navy .rcv-h::after { background: #e5b96f; height: 1px; flex: 0 0 10mm; }
.rcv--navy .rcv-bullets li::before { background: #0e2138; opacity: .55; }

/* ═══════════════════════ TERRA ═══════════════════════ */
.rcv--terra { --paper: #fffdf8; --ink: #2f241c; --accent: #9a4a24; --rule: #e8dccd; --muted: #6d5c4d; font-family: var(--rcv-font, Georgia, "Times New Roman", serif); }
.rcv--terra .rcv-head { padding-bottom: 4.5mm; border-bottom: 2px solid #9a4a24; }
.rcv--terra .rcv-name { font-size: 2.55em; letter-spacing: -.01em; }
.rcv--terra .rcv-role { color: #9a4a24; letter-spacing: .2em; }
.rcv--terra .rcv-h { display: block; padding-bottom: 1.2mm; border-bottom: 1px solid var(--rule); letter-spacing: .2em; color: #9a4a24; }
.rcv--terra .rcv-h::after { display: none; }
.rcv--terra .rcv-summary { font-size: 1.06em; line-height: 1.62; font-style: italic; color: #4a3a2d; }
.rcv--terra .rcv-tag { background: #f8efe3; border-color: #ecdcc8; color: #7a3a1c; }
.rcv--terra .rcv-bullets li::before { background: #b46a42; opacity: .75; }

/* ═══════════════════════ ENHANCV ═══════════════════════ */
.rcv--enhancv { --accent: #0b72e7; --rule: #e1e7ef; --muted: #5b6675; }
.rcv--enhancv .rcv-head { display: flex; align-items: center; gap: 5mm; padding-bottom: 4.5mm; border-bottom: 1px solid var(--rule); }
.rcv--enhancv .rcv-avatar { background: #0b72e7; color: #fff; width: 20mm; height: 20mm; font-size: 1.4em; }
.rcv--enhancv .rcv-name { font-size: 2.15em; letter-spacing: -.03em; }
.rcv--enhancv .rcv-role { color: #0b72e7; letter-spacing: .14em; }
.rcv--enhancv .rcv-h { color: #0b72e7; font-size: .72em; letter-spacing: .2em; }
.rcv--enhancv .rcv-h::after { background: #e1e7ef; }
.rcv--enhancv .rcv-tag { background: #f1f7ff; border-color: #d7e6fa; color: #1a5fae; }
.rcv--enhancv .rcv-bullets li::before { background: #0b72e7; opacity: .5; }

/* ═══════════════════════ EUROPASS ═══════════════════════ */
.rcv--europass { --accent: #1c3f66; --rule: #d9e1ec; --tint: #f1f5fa; }
.rcv--europass .rcv-head { display: flex; align-items: center; gap: 5mm; padding-bottom: 4mm; border-bottom: 2px solid #1c3f66; }
.rcv--europass .rcv-avatar { background: #1c3f66; color: #fff; width: 24mm; height: 24mm; font-size: 1.6em; border-radius: 2mm; }
.rcv--europass .rcv-name { font-size: 2.15em; }
.rcv--europass .rcv-role { color: #1c3f66; }
.rcv--europass .rcv-side { padding: 4mm; background: #f5f8fc; border-radius: 2mm; align-self: flex-start; }
.rcv--europass .rcv-side .rcv-section { margin-top: 5mm; }
.rcv--europass .rcv-side .rcv-h { font-size: .68em; letter-spacing: .16em; }
.rcv--europass .rcv-side .rcv-h::after { display: none; }
.rcv--europass .rcv-tag { background: #fff; border-color: #d9e1ec; color: #1c3f66; }
.rcv--europass .rcv-bullets li::before { background: #1c3f66; opacity: .5; }

/* ═══════════════════════ CANADIAN ═══════════════════════ */
.rcv--canadian { --accent: #b3202c; --rule: #f0d8da; --tint: #fdf3f4; }
.rcv--canadian .rcv-head { padding-bottom: 4mm; border-bottom: 3px solid #b3202c; }
.rcv--canadian .rcv-name { font-size: 2.4em; letter-spacing: -.02em; }
.rcv--canadian .rcv-role { color: #b3202c; letter-spacing: .18em; }
.rcv--canadian .rcv-h { color: #b3202c; font-size: .72em; letter-spacing: .2em; }
.rcv--canadian .rcv-h::after { background: #f0d8da; }
.rcv--canadian .rcv-tag { background: #fdf3f4; border-color: #f2d3d6; color: #8e1a24; }
.rcv--canadian .rcv-bullets li::before { background: #b3202c; opacity: .55; }

/* ═══════════════════════ FOTORAM ═══════════════════════ */
.rcv--fotoram { --accent: #3a6ea5; --rule: #dde5ee; }
.rcv--fotoram .rcv-head { display: flex; align-items: center; gap: 6mm; padding: 7mm 8mm; margin: 0 0 5mm; background: linear-gradient(135deg, #151b26 0%, #22303f 55%, #2f4a63 100%); color: #fff; }
.rcv--fotoram .rcv-head .rcv-avatar { background: rgba(255,255,255,.12); color: #fff; width: 27mm; height: 27mm; font-size: 1.7em; border: 1px solid rgba(255,255,255,.18); }
.rcv--fotoram .rcv-name { color: #fff; font-size: 2.2em; letter-spacing: -.02em; }
.rcv--fotoram .rcv-role { color: #a9c4dd; letter-spacing: .18em; }
.rcv--fotoram .rcv-contact { color: #c3d3e2; }
.rcv--fotoram .rcv-sep { color: rgba(255,255,255,.3); }
.rcv--fotoram .rcv-h { color: #22303f; font-size: .72em; letter-spacing: .2em; }
.rcv--fotoram .rcv-h::after { background: #dde5ee; }
.rcv--fotoram .rcv-tag { background: #f2f6fa; border-color: #dde5ee; color: #2f4a63; }
.rcv--fotoram .rcv-bullets li::before { background: #3a6ea5; opacity: .55; }

/* ═══════════════════════ ZETY ═══════════════════════ */
.rcv--zety { display: flex; padding: 14mm 15mm; min-height: 297mm; }
.rcv--zety .rcv-side { width: 64mm; flex-shrink: 0; background: #22303f; color: #e6edf4; padding: 14mm 7mm 14mm 8mm; text-align: left; }
.rcv--zety .rcv-main { flex: 1; min-width: 0; padding: 15mm 10mm 14mm 8mm; }
.rcv--zety .rcv-side .rcv-name { color: #fff; font-size: 1.7em; letter-spacing: .01em; line-height: 1.12; }
.rcv--zety .rcv-side .rcv-role { color: #93b4d1; font-size: .68em; letter-spacing: .18em; }
.rcv--zety .rcv-side .rcv-avatar, .rcv--zety .rcv-side .rcv-photo { margin: 0 auto 5mm; width: 28mm; height: 28mm; background: rgba(255,255,255,.08); color: #fff; border: 1px solid rgba(255,255,255,.16); }
.rcv--zety .rcv-contact { display: block; margin-top: 5mm; font-size: .75em; color: #b3c7d9; }
.rcv--zety .rcv-contact .rcv-ci { display: block; margin-bottom: 1.2mm; white-space: normal; }
.rcv--zety .rcv-sep { display: none; }
.rcv--zety .rcv-side .rcv-h { color: #93b4d1; font-size: .66em; letter-spacing: .18em; margin-bottom: 2.5mm; }
.rcv--zety .rcv-side .rcv-h::after { background: rgba(255,255,255,.12); }
.rcv--zety .rcv-side .rcv-section { margin-top: 6.5mm; }
.rcv--zety .rcv-side .rcv-degree, .rcv--zety .rcv-side .rcv-cert { color: #e6edf4; }
.rcv--zety .rcv-side .rcv-school, .rcv--zety .rcv-side .rcv-note, .rcv--zety .rcv-side .rcv-inline-list { color: #91a8bc; }
.rcv--zety .rcv-side .rcv-tag { background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.1); color: #d8e4ee; }
.rcv--zety .rcv-side .rcv-lang { color: #d8e4ee; border-color: rgba(255,255,255,.1); }
.rcv--zety .rcv-side .rcv-lang span { color: #91a8bc; }
.rcv--zety .rcv-h { color: #22303f; }
.rcv--zety .rcv-h::after { background: #dbe3eb; }
.rcv--zety .rcv-bullets li::before { background: #22303f; opacity: .5; }

/* ═══════════════════════ RESUME.IO ═══════════════════════ */
.rcv--resumeio { --accent: #2563eb; --rule: #e2e8f0; --tint: #eff6ff; }
.rcv--resumeio .rcv-head { display: flex; align-items: center; gap: 5mm; padding: 6mm 7mm; margin: 0 0 5mm; background: #f5f8fc; border-bottom: 2px solid #2563eb; }
.rcv--resumeio .rcv-avatar { background: #2563eb; color: #fff; width: 22mm; height: 22mm; font-size: 1.45em; }
.rcv--resumeio .rcv-name { font-size: 2.1em; letter-spacing: -.025em; }
.rcv--resumeio .rcv-role { color: #2563eb; letter-spacing: .15em; }
.rcv--resumeio .rcv-h { color: #2563eb; font-size: .72em; letter-spacing: .2em; }
.rcv--resumeio .rcv-h::after { background: #dbe6f6; }
.rcv--resumeio .rcv-tag { background: #eff6ff; border-color: #dbe6f6; color: #1d4ed8; }
.rcv--resumeio .rcv-bullets li::before { background: #2563eb; opacity: .5; }

/* ═══════════════════════ EDITORIAL (new) ═══════════════════════ */
.rcv--editorial { --paper: #fffefb; --ink: #1a1714; --accent: #8f3a22; --rule: #e6ded2; --muted: #6b6157; font-family: var(--rcv-font, Georgia, "Times New Roman", serif); }
.rcv--editorial .rcv-head { padding-bottom: 5mm; border-bottom: 1px solid var(--ink); }
.rcv--editorial .rcv-name { font-size: 3.1em; font-weight: 400; letter-spacing: -.045em; line-height: .98; }
.rcv--editorial .rcv-role { margin-top: 2.4mm; color: #8f3a22; font-size: .76em; letter-spacing: .24em; font-weight: 600; }
.rcv--editorial .rcv-contact { margin-top: 3.5mm; font-size: .78em; }
.rcv--editorial .rcv-summary { font-size: 1.16em; line-height: 1.6; color: #3a332c; }
.rcv--editorial .rcv-summary::first-letter { font-size: 1.1em; }
.rcv--editorial .rcv-h { position: relative; display: block; padding-left: 9mm; font-size: .7em; letter-spacing: .24em; color: #8f3a22; margin-bottom: 3.5mm; }
.rcv--editorial .rcv-h::before { content: counter(rcv-sec, decimal-leading-zero); position: absolute; left: 0; top: -.2em; font-size: 1.2em; letter-spacing: .05em; color: #b9aa98; font-style: italic; }
.rcv--editorial .rcv-h::after { display: none; }
.rcv--editorial { counter-reset: rcv-sec; }
.rcv--editorial .rcv-section { counter-increment: rcv-sec; }
.rcv--editorial .rcv-with-date { display: grid; grid-template-columns: 1fr 26mm; gap: 5mm; align-items: start; }
.rcv--editorial .rcv-date { text-align: right; padding-top: .5mm; }
.rcv--editorial .rcv-bullets li::before { background: #8f3a22; opacity: .6; width: 1.3mm; height: 1.3mm; }
.rcv--editorial .rcv-tag { background: none; border: 0; padding: 0; font-size: .82em; }
.rcv--editorial .rcv-tag + .rcv-tag::before { content: "·"; color: #b9aa98; padding: 0 1.6mm; }

/* ═══════════════════════ ATLAS (new) ═══════════════════════ */
.rcv--atlas { --accent: #1e4ed8; --rule: #dfe4ee; --tint: #f3f6fd; }
.rcv--atlas .rcv-head { display: grid; grid-template-columns: 1fr auto; gap: 6mm; align-items: end; padding-bottom: 4mm; border-bottom: 2px solid #1e4ed8; }
.rcv--atlas .rcv-name { font-size: 2.65em; font-weight: 800; letter-spacing: -.045em; line-height: .95; }
.rcv--atlas .rcv-role { color: #1e4ed8; letter-spacing: .16em; }
.rcv--atlas .rcv-contact { margin-top: 0; justify-content: flex-end; max-width: 82mm; text-align: right; }
.rcv--atlas .rcv-h { font-size: .7em; letter-spacing: .24em; color: #1e4ed8; gap: 2.5mm; }
.rcv--atlas .rcv-h::before { content: "//"; color: #9db0dd; letter-spacing: 0; }
.rcv--atlas .rcv-h::after { background: #dfe4ee; }
.rcv--atlas .rcv-tag { background: #f3f6fd; border-color: #dfe4ee; color: #1e3a8a; }
.rcv--atlas .rcv-bullets li::before { border-radius: 0; background: #1e4ed8; opacity: .6; width: 1.4mm; height: 1.4mm; }

/* Fluid (non-paginated) preview used in analysis panels */
.rcv-fluid .rcv { width: 100%; min-height: 0; padding: 10mm; }
.rcv-fluid .rcv--modern, .rcv-fluid .rcv--navy, .rcv-fluid .rcv--zety { min-height: 0; }

/* ═══════════════════════ MAANG ═══════════════════════ */
/* Built from the actual format behind big-tech callbacks: the Jake's Resume
   lineage — serif, one column, centered contact, ruled uppercase headings,
   Education/Experience/Projects/Technical Skills, GPA + coursework, GitHub,
   project links, and 2–4 dense X-Y-Z bullets per role. */
.rcv--maang {
  --ink: #000000;
  --muted: #222222;
  --faint: #333333;
  --accent: #000000;
  --rule: #000000;
  --tint: #ffffff;
  font-family: var(--rcv-font, Georgia, "Times New Roman", serif);
  font-size: calc(var(--rcv-size, 11pt) * 0.93);
  line-height: 1.34;
  letter-spacing: 0;
}
.rcv--maang .rcv-head {
  text-align: center;
  padding-bottom: 2mm;
  border-bottom: 1px solid #000;
}
.rcv--maang .rcv-name {
  font-size: 2.15em;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: none;
  line-height: 1.05;
}
.rcv--maang .rcv-role { display: none; }
.rcv--maang .rcv-contact {
  justify-content: center;
  gap: .6mm 0;
  margin-top: 1.4mm;
  font-size: .8em;
  color: #000;
}
.rcv--maang .rcv-ci a { border-bottom: 0; }
.rcv--maang .rcv-sep { padding: 0 2.2mm; color: #000; }
.rcv--maang .rcv-section { margin-top: 3mm; }
.rcv--maang .rcv-h {
  display: block;
  padding-bottom: .7mm;
  margin-bottom: 1.7mm;
  border-bottom: 1px solid #000;
  font-size: .86em;
  font-weight: 700;
  letter-spacing: .045em;
  text-transform: uppercase;
  color: #000;
}
.rcv--maang .rcv-h::after { display: none; }
.rcv--maang .rcv-item { margin-bottom: 2.6mm; }
.rcv--maang .rcv-job-title { font-size: 1em; font-weight: 700; line-height: 1.28; }
.rcv--maang .rcv-org {
  margin-top: 0;
  font-size: .95em;
  font-weight: 400;
  font-style: italic;
  color: #111;
}
.rcv--maang .rcv-date { font-size: .8em; font-weight: 400; color: #111; letter-spacing: 0; }
.rcv--maang .rcv-desc { margin-top: .5mm; font-size: .95em; line-height: 1.4; color: #111; }
.rcv--maang .rcv-bullets { margin-top: .8mm; }
.rcv--maang .rcv-bullets li {
  padding-left: 3.4mm;
  margin-bottom: .25mm;
  font-size: .95em;
  line-height: 1.36;
  color: #111;
}
.rcv--maang .rcv-bullets li::before {
  width: .9mm;
  height: .9mm;
  top: .57em;
  background: #000;
  opacity: 1;
}
.rcv--maang .rcv-degree { font-size: 1em; font-weight: 700; }
.rcv--maang .rcv-school { margin-top: 0; font-size: .95em; font-style: italic; color: #111; }
.rcv--maang .rcv-note { margin-top: .2mm; font-size: .86em; color: #222; }
.rcv--maang .rcv-skill-line { font-size: .94em; line-height: 1.42; color: #111; }
.rcv--maang .rcv-skill-groups { font-size: .94em; line-height: 1.46; color: #111; }
.rcv--maang .rcv-skill-groups p { margin: 0 0 .4mm; }
.rcv--maang .rcv-skill-groups b { font-weight: 700; font-style: italic; }
.rcv--maang .rcv-tag { padding: 0; border: 0; background: none; font-size: .9em; }
.rcv--maang .rcv-tech { font-size: .82em; color: #222; font-style: italic; }
.rcv--maang .rcv-proj-link { color: #111; text-decoration: underline; text-underline-offset: 1.5px; font-size: .9em; }
.rcv--maang .rcv-cert { font-size: .92em; padding-left: 3.8mm; }
.rcv--maang .rcv-cert::before { content: "•"; color: #000; }
.rcv--maang .rcv-lang { font-size: .9em; }

/* ═══════════════════════ Print ═══════════════════════ */
@media print {
  .rcv { width: 100%; min-height: 0; padding: 0; box-shadow: none; }
  .rcv--modern, .rcv--navy, .rcv--zety { min-height: 269mm; }
  .rcv, .rcv * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .rcv-item, .rcv-bullets li { break-inside: avoid; page-break-inside: avoid; }
  .rcv-h { break-after: avoid; page-break-after: avoid; }
  .rcv-job, .rcv-edu { orphans: 3; widows: 3; }
}
`;
