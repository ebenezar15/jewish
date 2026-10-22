# Content format

Each file in `app/content/` pushes one study onto `window.BOOKS`:

```js
window.BOOKS.push({
  id: "jesus",                 // url slug
  title: "Listening to the Jewish Jesus",
  short: "The Jewish Jesus",   // used in breadcrumbs
  tagline: "One sentence shown on the home card.",
  intro: "2-3 sentence introduction shown on the study page.",
  icon: "scroll",              // scroll | calendar | lamp | book
  color: "#2B59C3",            // card accent
  overview: [ /* blocks */ ],  // the study's Overview tab
  chapters: [{
    id: "kebab-case-id",
    title: "Chapter title",
    summary: "One or two sentence plain-English summary.",
    sections: [{ h: "Section heading", blocks: [ /* blocks */ ] }],
    keypoints: ["...", "..."],
    quiz: [{ q: "Question?", options: ["a","b","c","d"], answer: 1, why: "Explanation." }]
  }]
});
```

Strings in blocks support `**bold**` and `*italic*`.

| t | fields | renders as |
|---|---|---|
| `p` | `text` | paragraph |
| `list` | `title?`, `items[]` | bullet list |
| `callout` | `kind` (`insight`/`note`/`warn`), `title?`, `text` | highlighted box |
| `quote` | `text`, `ref` | Scripture quote with reference |
| `term` | `word`, `heb?` (Hebrew/Greek script), `lang?`, `meaning` | glossary card (auto-collected into the Glossary) |
| `flow` | `title?`, `nodes[]` (string or `{h,d}`) | horizontal flowchart with animated arrows |
| `steps` | `title?`, `items[{h,d}]` | vertical numbered flowchart |
| `compare` | `title?`, `cols[{h, items[]}]` (2-3 cols) | side-by-side comparison |
| `timeline` | `title?`, `items[{when,h,d}]` | timeline |
| `cards` | `title?`, `items[{h,d}]` | card grid |
| `table` | `title?`, `head[]`, `rows[[...]]` | table |
| `tree` | `title?`, `root`, `children[{h,d?,children?}]` | skeleton / mind-map tree |
| `cycle` | `title?`, `center`, `hint?`, `items[{h,d}]` (3-8) | interactive circular diagram |
| `flip` | `title?`, `items[{front, back}]` | flip flashcards (auto-collected into Flashcards) |

Run `python3 app/build.py` to bundle everything into `index.html`.

## Interactive blocks (src/blocks2.js)

| t | fields | renders as |
|---|---|---|
| `map` | `title`, `base` (`neareast`: Egypt to Persia, lon 24–52 / lat 24–38.5; or `israel`: lon 33.9–36.9 / lat 29.4–33.7), `intro?`, `regions?[{name,lon,lat}]` (big faint labels like "EGYPT"), `places[{name, lon, lat, d, label?:"left"}]`, `routes?[{from, to, label, d?, color?, bend?}]` (`from`/`to` are place names; `bend` -0.4..0.4 curves the arrow) | real-coordinate map; routes animate in order, places tap for info |
| `tabernacle` | `title`, `intro_h?`, `intro?`, `items{gate, altar, laver, holyplace, lampstand, table, incense, veil, ark}` each `{h, d, ref?, christ?}` | clickable tabernacle floor plan with a guided walk |
| `connect` | `title`, `left?`, `right?`, `pairs[{a, b, d, ref?}]` | two columns joined by drawn lines; tap to explain the link |
| `match` | `title`, `how?`, `pairs[{a, b}]` (4–8) | tap-to-match game, right column shuffled |
| `rings` | `title`, `center?`, `hint?`, `items[{h, d}]` outermost first (3–6) | concentric clickable zones |
| `kings` | `title`, `items[{name, group, when, verdict:"good"/"bad"/"mixed", d, ref}]` | filterable reign chart (filter chips by `group`) |
| `stepper` | `title`, `items[{h, d, why?, christ?, ref?}]` | step-by-step animated walkthrough |
| `accordion` | `title?`, `items[{h, d, ref?}]` (`d` may contain blank-line paragraphs) | expandable details |
