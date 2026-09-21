#!/usr/bin/env python3
"""
Generate markdown files for each group as chapter in mountain2/
using the same syntax and table structure as in mountain/.
"""

import json
import re
from pathlib import Path
from bs4 import BeautifulSoup


def clean_text(text: str) -> str:
    """Normalize spaces and non-breaking spaces."""
    return " ".join(text.split())


def parse_group(group_data: dict) -> list[list[str]]:
    """Parse words in a group into rows for the markdown table."""
    words = group_data.get("mountain_contents", [])
    rows = []

    for item in words:
        title = item.get("title", "").strip().lower()
        desc = item.get("description", "")
        # Split multiple definitions by <hr />
        parts = re.split(r"<hr\s*/?>", desc)

        for p_idx, part in enumerate(parts):
            soup = BeautifulSoup(part, "html.parser")

            # Extract category (part of speech)
            cat = ""
            for strong in soup.find_all("strong"):
                txt = strong.get_text().strip().lower().rstrip(":").strip()
                if txt in ["verb", "adjective", "noun", "adverb", "preposition", "conjunction", "pronoun", "interjection"]:
                    cat = txt
                    break
            if not cat:
                m = re.search(r"\b(verb|adjective|noun|adverb)\b", soup.get_text().lower())
                if m:
                    cat = m.group(1)

            # Extract meanings (first non-empty ul)
            uls = [ul for ul in soup.find_all("ul") if ul.find_all("li")]
            meanings = []
            if len(uls) >= 1:
                for li in uls[0].find_all("li"):
                    t = clean_text(li.get_text()).rstrip(".")
                    if t:
                        meanings.append(t)
            meaning_str = "; ".join(meanings)

            # Extract synonyms (second non-empty ul)
            synonyms = []
            if len(uls) >= 2:
                for li in uls[1].find_all("li"):
                    t = clean_text(li.get_text()).rstrip(".")
                    # Filter out non-synonym messages
                    if t and not ("find any" in t.lower() or "no great synonyms" in t.lower()):
                        synonyms.append(t)
            synonyms_str = ", ".join(synonyms)

            # Only show word title on the primary definition row
            word_str = title if p_idx == 0 else ""
            rows.append([word_str, cat, meaning_str, synonyms_str, "", ""])

    return rows


def format_table(rows: list[list[str]]) -> str:
    """Format markdown table with aligned columns and centered content."""
    headers = ["word", "category", "meaning", "synonyms", "example", "notes"]
    all_rows = [headers] + rows

    col_widths = []
    for c in range(len(headers)):
        max_len = max(len(r[c]) for r in all_rows)
        max_len = max(max_len, 4)  # Ensure minimum width for markdown separator :-:
        col_widths.append(max_len)

    lines = []
    # Header row
    lines.append("|" + "|".join(" " + h.center(w) + " " for h, w in zip(headers, col_widths)) + "|")
    # Separator row
    lines.append("|" + "|".join(" :" + "-" * (w - 2) + ": " for w in col_widths) + "|")
    # Data rows
    for r in rows:
        lines.append("|" + "|".join(" " + cell.center(w) + " " for cell, w in zip(r, col_widths)) + "|")

    return "\n".join(lines) + "\n"


def main():
    json_path = Path("/home/aryansinghal/Desktop/vocab/api_response.json")
    out_dir = Path("/home/aryansinghal/Desktop/vocab/mountain2")
    out_dir.mkdir(parents=True, exist_ok=True)

    with open(json_path, encoding="utf-8") as f:
        data = json.load(f)

    print(f"Loaded {len(data)} groups from {json_path}")

    for idx, group in enumerate(data, start=1):
        rows = parse_group(group)
        md_content = format_table(rows)
        chapter_file = out_dir / f"chapter{idx}.md"
        chapter_file.write_text(md_content, encoding="utf-8")
        print(f"Generated {chapter_file.name} with {len(rows)} rows ({len(group.get('mountain_contents', []))} words)")

    print(f"Successfully generated all {len(data)} chapters in {out_dir}")


if __name__ == "__main__":
    main()
