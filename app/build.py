"""Bundle the app into one self-contained HTML file (index.html at the repo root)."""
import glob, os
here = os.path.dirname(os.path.abspath(__file__))
src = lambda p: open(os.path.join(here, p), encoding="utf-8").read()
html = src("src/index.html")
content = "window.BOOKS = [];\n" + "\n".join(open(f, encoding="utf-8").read() for f in sorted(glob.glob(os.path.join(here, "content", "*.js"))))
html = html.replace("/*STYLES*/", src("src/styles.css")).replace("/*CONTENT*/", content).replace("/*APP*/", src("src/app.js"))
out = os.path.join(here, "..", "index.html")
open(out, "w", encoding="utf-8").write(html)
print("wrote", os.path.normpath(out), len(html) // 1024, "KB")
