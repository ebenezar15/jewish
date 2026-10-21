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
