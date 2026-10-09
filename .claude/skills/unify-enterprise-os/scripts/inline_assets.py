#!/usr/bin/env python3
"""Rewrite src="assets/..." to base64 data: URIs so the HTML stands alone.

A page that references assets/ renders correctly when served and turns into a
grid of broken-image boxes the moment anyone opens the file directly or views it
as a preview snapshot -- which is how these builds actually get opened. Inlining
is part of delivery, not an optimisation.

The assets/ folder stays as the source of record; only index.html changes.

    python3 inline_assets.py figma-frames/brain-87-chat [more-folders...]
    python3 inline_assets.py --check figma-frames/brain-87-chat   # verify only
"""
from __future__ import annotations

import argparse, base64, os, pathlib, re, sys

MIME = {".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp",
        ".woff2": "font/woff2"}
PATTERN = re.compile(r'src="(assets/[^"]+)"')


def process(folder: pathlib.Path, check_only: bool) -> bool:
    html_path = folder / "index.html"
    if not html_path.is_file():
        print(f"{folder}: no index.html")
        return False

    html = html_path.read_text(encoding="utf-8")
    refs = PATTERN.findall(html)

    if check_only:
        ok = not refs
        print(f"{folder}: {'self-contained' if ok else f'{len(refs)} external refs remain'}")
        return ok

    cache: dict[str, str] = {}
    missing: list[str] = []

    def repl(m: re.Match) -> str:
        rel = m.group(1)
        if rel in cache:
            return f'src="{cache[rel]}"'
        full = folder / rel
        if not full.is_file():
            missing.append(rel)
            return m.group(0)
        ext = full.suffix.lower()
        if ext not in MIME:
            missing.append(f"{rel} (unknown type)")
            return m.group(0)
        cache[rel] = (f"data:{MIME[ext]};base64,"
                      + base64.b64encode(full.read_bytes()).decode("ascii"))
        return f'src="{cache[rel]}"'

    out = PATTERN.sub(repl, html)
    if missing:
        print(f"{folder}: MISSING {len(missing)} asset(s) -- nothing written")
        for m in missing:
            print(f"    {m}")
        return False

    html_path.write_text(out, encoding="utf-8")
    size_kb = os.path.getsize(html_path) // 1024
    print(f"{folder}: inlined {len(refs)} refs ({len(cache)} unique) -> {size_kb} KB, self-contained")
    return True


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("folders", nargs="+")
    ap.add_argument("--check", action="store_true", help="report only, do not modify")
    args = ap.parse_args()
    results = [process(pathlib.Path(f), args.check) for f in args.folders]
    return 0 if all(results) else 1


if __name__ == "__main__":
    sys.exit(main())
