# Vocab Galaxy 🌌

An interactive web application that visualizes **1,020 GRE vocabulary words** from GregMat's Vocab Mountain, grouped by **strict semantic similarity** into **264 cohesive synonym brackets** plus a dedicated **Miscellaneous (Outliers & Unique Terms)** cluster.

---

## 🚀 How to Run

### Method 1: Local Server (Recommended)
```bash
python3 serve.py
```
This opens `http://localhost:8080/` in your browser.

### Method 2: Direct File Open (Offline & Zero-Setup)
You can directly open `web/index.html` in Chrome, Firefox, or Safari:
```bash
google-chrome web/index.html
```
*(Uses pre-bundled `data.js` so it functions offline with zero CORS restrictions!)*

---

## 🧠 How the Semantic Clustering Works

1. **Feature Extraction:**
   - For every word, its definition, part of speech, and list of synonyms are extracted from the raw HTML descriptions in `vocab_mountain.json`.
2. **Dense Vector Embeddings (`BAAI/bge-small-en-v1.5`):**
   - High-performance 384-dimensional dense semantic vectors are generated for each term using ONNX runtime.
3. **Strict Semantic Brackets & Outlier Clustering:**
   - Using average-linkage hierarchical clustering with high cosine similarity thresholds, words are grouped into **264 tightly cohesive synonym brackets** (e.g. *Curb & Impede*, *Transient & Momentary*, *Pernicious & Detrimental*, *Meticulous & Punctilious*, *Specious & Spurious*, etc.) where only truly similar words are grouped together.
   - Solitary words with distinct or specialized meanings that do not join a tight synonym bracket are placed into a dedicated **Miscellaneous (Outliers & Unique Terms)** cluster.
4. **2D Spatial Projection (t-SNE):**
   - Projected onto 2D canvas coordinates using t-SNE with cosine distance, ensuring words with similar meanings land near each other.
5. **Nearest Neighbor Connections:**
   - Pairwise cosine similarities identify the top 6 closest semantic siblings for each term, rendered as synaptic links when hovering.

---

## ✨ Features

- **🌌 2D Interactive Semantic Map:**
  - High-performance HTML5 Canvas with smooth 60fps pan & zoom.
  - Hovering over any word displays an **instant popup with the full rendered HTML description** (definition, examples in italics, parts of speech, and synonyms).
  - Glowing synaptic connection lines link hovered words to their nearest semantic neighbors.
- **🗂️ Similarity Brackets View:**
  - Words organized into 264 tightly cohesive synonym bracket cards plus a dedicated Outlier card.
  - Interactive chips with hover tooltips and instant inspection.
- **🕸️ Synonym Network (Constellation Graph):**
  - Direct visualization of similarity edges above a customizable threshold slider (0.65 to 0.88).
- **🏔️ Mountain Groups View:**
  - View the original linear 34 GregMat groups side-by-side with their new semantic cluster colors.
- **⭐ Struggle & Revision Bucket:**
  - Star difficult words directly from any card chip, the hover popup, or the detail drawer.
  - Dedicated **Struggle Bucket** tab to revise only words you struggle with, without having to review all 1,020 words every time.
  - **Two Revision Modes:**
    - *Semantic Brackets Mode*: Study difficult words organized by their meaning brackets.
    - *Flashcard Quiz Mode*: Interactive flip cards (definition, mnemonic, examples) with *Mastered* and *Keep in Bucket* actions. Supports keyboard navigation (`Left`/`Right` to navigate, `Space`/`Enter` to flip).
  - **Struggling Only Filter**: Filter the entire Galaxy Map and other views to show only your struggling words, with distinctive amber highlight rings.
  - **Persistence & Export**: Automatically saves to `localStorage` and supports exporting your struggle list as a clean JSON file.
- **🔊 Audio Pronunciations:**
  - Built-in audio playback using GregMat AWS Polly pronunciation files.
- **🔍 Instant Search & Jump:**
  - Typeahead autocomplete across words, definitions, and synonyms.
  - Press `/` or `Ctrl+K` to search; selecting a word smoothly flies the camera right to it.
- **🌓 Dark & Light Modes:**
  - Deep obsidian cosmic galaxy theme and crisp editorial light theme.

---

## 🛠️ Re-generating Embeddings

If you modify `vocab_mountain.json`:
```bash
source .venv/bin/activate
python build_dataset.py
```
This updates `web/data.json` and `web/data.js`.
