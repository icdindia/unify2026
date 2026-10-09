#!/usr/bin/env python3
"""Download Figma MCP asset exports and verify they are real files.

Figma's asset URLs expire in about a week, so every export referenced by a build
has to be pulled down and committed. Doing it by hand is where silent failures
creep in: an expired or errored URL returns an HTML error page with a 200, which
lands as a zero-byte or text "SVG" that renders as nothing.

Manifest: one "<local-name> <asset-id-or-url>" per line, blank lines and #
comments ignored.

    logo-00.svg  dda3ccd3-533c-4823-9648-3ed7ac9b4bbe.svg
    thumb-1.png  74f551fd-9488-4461-a730-1ed943fc4d87.png

    python3 fetch_assets.py manifest.txt --out figma-frames/my-frame/assets
"""
from __future__ import annotations

import argparse, pathlib, sys, urllib.request

BASE = "https://www.figma.com/api/mcp/asset/"
MAGIC = {".png": b"\x89PNG", ".jpg": b"\xff\xd8", ".jpeg": b"\xff\xd8"}


def looks_valid(path: pathlib.Path, data: bytes) -> str | None:
    if not data:
        return "empty file"
    ext = path.suffix.lower()
    if ext == ".svg":
        head = data[:400].lstrip()
        if not (head.startswith(b"<svg") or head.startswith(b"<?xml")):
            return "not an SVG (likely an HTML error page)"
    elif ext in MAGIC and not data.startswith(MAGIC[ext]):
        return f"not a valid {ext[1:].upper()}"
    return None


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("manifest")
    ap.add_argument("--out", required=True)
    args = ap.parse_args()

    out = pathlib.Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    entries = []
    for raw in pathlib.Path(args.manifest).read_text().splitlines():
        line = raw.split("#", 1)[0].strip()
        if not line:
            continue
        name, _, ref = line.partition(" ")
        ref = ref.strip()
        if not ref:
            print(f"  SKIP  malformed line: {raw!r}")
            continue
        entries.append((name, ref if ref.startswith("http") else BASE + ref))

    failures = []
    for name, url in entries:
        dest = out / name
        try:
            with urllib.request.urlopen(url, timeout=60) as r:
                data = r.read()
        except Exception as exc:                      # noqa: BLE001
            failures.append((name, str(exc)))
            print(f"  FAIL  {name}: {exc}")
            continue
        problem = looks_valid(dest, data)
        if problem:
            failures.append((name, problem))
            print(f"  FAIL  {name}: {problem}")
            continue
        dest.write_bytes(data)
        print(f"  ok    {name:32} {len(data):>8,} bytes")

    print(f"\n{len(entries) - len(failures)}/{len(entries)} downloaded into {out}")
    if failures:
        print("\nFAILED — do not build against these:")
        for name, why in failures:
            print(f"  {name}: {why}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
