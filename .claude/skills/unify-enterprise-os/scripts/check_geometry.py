#!/usr/bin/env python3
"""Diff a rendered build against the Figma node tree. This is the pass/fail gate.

Positions in get_metadata output are PARENT-RELATIVE. Resolving them by hand is
where mistakes creep in -- a nested y=128 under a parent at y=28 is absolute 156,
and misreading that once nearly "corrected" an already-correct element. This
walks the tree and does the arithmetic.

    # 1. paste the get_metadata output into frame.xml
    # 2. run scripts/measure_frame.js in the browser, save output to measured.json
    python3 check_geometry.py frame.xml measured.json

Exit code 0 = every tagged node matches. Non-zero = drift, listed worst first.
"""
from __future__ import annotations

import argparse, json, pathlib, re, sys

NODE = re.compile(
    r'<(?P<tag>[a-z-]+)\s+id="(?P<id>[^"]+)"'
    r'(?P<attrs>[^>]*?)'
    r'\s*(?P<selfclose>/)?>'
)
ATTR = re.compile(r'(\w+)="([^"]*)"')


def parse_tree(xml: str):
    """Indentation-based walk of the get_metadata dump -> {id: (x, y, w, h)} absolute.

    Hidden nodes are skipped along with their subtree: they do not render, so
    comparing against them produces phantom failures.
    """
    out, stack = {}, []          # stack of (indent, abs_x, abs_y)
    hidden_indent = None

    for line in xml.splitlines():
        m = NODE.search(line)
        if not m:
            continue
        indent = len(line) - len(line.lstrip())

        if hidden_indent is not None:
            if indent > hidden_indent:
                continue         # still inside the hidden subtree
            hidden_indent = None

        attrs = dict(ATTR.findall(m.group("attrs")))
        if attrs.get("hidden") == "true":
            hidden_indent = indent
            continue

        while stack and stack[-1][0] >= indent:
            stack.pop()
        px, py = (stack[-1][1], stack[-1][2]) if stack else (0.0, 0.0)

        try:
            x = px + float(attrs["x"]); y = py + float(attrs["y"])
            w = float(attrs["width"]); h = float(attrs["height"])
        except (KeyError, ValueError):
            continue

        out[m.group("id")] = (x, y, w, h)
        if not m.group("selfclose"):
            stack.append((indent, x, y))
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("frame_xml")
    ap.add_argument("measured_json")
    ap.add_argument("--root", help="node id to treat as origin (default: outermost in the XML)")
    ap.add_argument("--tol", type=float, default=1.0, help="position/size tolerance in px")
    ap.add_argument("--text-tol", type=float, default=1.75,
                    help="WIDTH tolerance only; font advance widths differ by ~1px "
                         "between Figma and Google Fonts. Keep this under 2: the most "
                         "common defect in this pipeline (a CSS border where Figma "
                         "draws the stroke inside) is exactly 2px, and a looser "
                         "tolerance hides it.")
    args = ap.parse_args()

    tree = parse_tree(pathlib.Path(args.frame_xml).read_text())
    if not tree:
        print("No nodes parsed from the XML -- is it the get_metadata dump?")
        return 2

    data = json.loads(pathlib.Path(args.measured_json).read_text())
    measured, root_id = data["boxes"], args.root or data.get("root")

    ox, oy = (tree[root_id][0], tree[root_id][1]) if root_id in tree else (0.0, 0.0)

    rows, near, checked = [], [], 0
    for nid, box in measured.items():
        if nid not in tree:
            continue
        checked += 1
        fx, fy, fw, fh = tree[nid]
        exp = (fx - ox, fy - oy, fw, fh)
        got = tuple(box)
        dw, dh = got[2] - exp[2], got[3] - exp[3]
        for i, label in enumerate(("x", "y", "w", "h")):
            d = got[i] - exp[i]
            if label == "w":
                tol = args.text_tol          # text advance widths wobble ~1px
            elif label == "h":
                tol = args.tol               # heights are line-height driven: exact
            else:
                # A hug-width node whose text measures slightly differently shifts
                # its own edge by the same amount when it is end-aligned. That is
                # a font-metric difference, not layout drift, so allow the
                # position to move as far as the size did.
                tol = args.tol + abs(dw if label == "x" else dh)
            if abs(d) > tol:
                rows.append((abs(d), nid, label, exp[i], got[i], d))
            elif label == "w" and abs(d) > 1.0:
                near.append((abs(d), nid, exp[i], got[i], d))

    missing = [n for n in measured if n not in tree]
    unchecked = [n for n in tree if n not in measured]

    print(f"compared {checked} tagged node(s) against {len(tree)} Figma node(s)\n")
    if rows:
        rows.sort(reverse=True)
        print(f"{'node':<34}{'':<3}{'figma':>10}{'built':>10}{'delta':>9}")
        for _, nid, label, e, g, d in rows:
            print(f"{nid:<34}{label:<3}{e:>10.2f}{g:>10.2f}{d:>+9.2f}")
        print(f"\nFAIL — {len(rows)} mismatch(es)")
    else:
        print("PASS — every tagged node matches within tolerance")

    if near:
        near.sort(reverse=True)
        print("\nnear tolerance (width only, font metrics — review if any look structural):")
        for _, nid, e, g, d in near:
            print(f"  {nid:<32}{e:>10.2f}{g:>10.2f}{d:>+9.2f}")

    if missing:
        print(f"\n{len(missing)} tagged node(s) not present in the Figma tree "
              f"(stale id, or built from a component's inner id): {missing[:8]}")
    if unchecked:
        print(f"\n{len(unchecked)} Figma node(s) carry no data-node-id in the build "
              f"— untested, not necessarily wrong")

    imgs = data.get("images", {})
    if imgs:
        bad = imgs.get("broken", 0)
        print(f"\nimages: {imgs.get('total')} total, {bad} broken, "
              f"allDataUris={imgs.get('allDataUris')}")
        if bad:
            print("  broken images — the build will not render standalone")
    return 1 if rows or (imgs.get("broken") or 0) else 0


if __name__ == "__main__":
    sys.exit(main())
