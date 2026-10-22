# Roots & Branches: an interactive Bible study app

An animated study app built from the three PDFs in this repository, plus a deep fourth study written from Scripture:

| Study | Chapters |
|---|---|
| Listening to the Jewish Jesus | 28 |
| The Feasts of Israel for Christians | 13 |
| Revelation: A Jewish Perspective | 15 |
| Shadows and Substance: covenants, law, tabernacle, sacrifices, purity, priests, Sabbath, festivals, judges, kings, prophets, exile and return, and how the relational gospel fulfils them | 15 |

Every chapter is explained in plain English and includes flowcharts, step diagrams, comparison panels, timelines, skeleton trees, interactive circle diagrams, Hebrew/Greek word cards, flip flashcards, key points and a quiz.

## Features
- Six colour schemes (Tekhelet, Galilee, Olive grove, Pomegranate, Midnight, Lamplight) and four text sizes
- Avenir Next font (built into Apple devices); other devices fall back to the very similar Nunito Sans
- Animated Bible maps with real geography, a walk-through tabernacle, step-by-step rituals, filterable charts of every judge, king and prophet, matching games and shadow-to-substance connection diagrams
- Bible atlas and Shadow to substance pages that gather every map and connection
- Search across all 71 chapters (press `/`)
- Glossary of every Hebrew and Greek term, shuffled flashcards, and big-picture mind maps of each study
- Reading progress saved on your device
- **Works offline on any device**: the whole app is one file, `index.html`

## Use it on any device
1. Download `index.html` (on GitHub: open the file, then choose **Download raw file**), or press **Download** inside the app.
2. Open it in any browser: phone, tablet or computer. No internet or installation is needed.
3. On a phone, use **Share → Add to Home Screen** to keep it like an app.

## Editing
Content lives in `app/content/*.js` (format in `app/CONTENT_SCHEMA.md`), the design in `app/src/`. Run `python3 app/build.py` to rebuild `index.html`.
