#!/usr/bin/env python3
from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_HOST = "felixkeuya.com"
LEGACY_HOST = "felix-keuya-portfolio.vercel.app"


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.links: list[tuple[str, str, dict[str, str]]] = []
        self.ids: set[str] = set()
        self.h1_count = 0
        self.title_count = 0
        self.meta_description = False
        self.canonical: str | None = None

    def handle_starttag(self, tag: str, attrs) -> None:
        data = {k: (v or "") for k, v in attrs}
        if data.get("id"):
            self.ids.add(data["id"])
        if tag == "h1":
            self.h1_count += 1
        if tag == "title":
            self.title_count += 1
        if tag == "meta" and data.get("name", "").lower() == "description" and data.get("content"):
            self.meta_description = True
        if tag == "link" and "canonical" in data.get("rel", "").lower():
            self.canonical = data.get("href") or None
        if tag == "a" and data.get("href"):
            self.links.append(("href", data["href"], data))
        if tag in {"script", "img"} and data.get("src"):
            self.links.append(("src", data["src"], data))
        if tag == "link" and data.get("href") and data.get("rel", "").lower() != "canonical":
            self.links.append(("href", data["href"], data))


def local_target(source: Path, raw: str) -> tuple[Path | None, str | None]:
    raw = raw.strip()
    if not raw or raw.startswith(("mailto:", "tel:", "javascript:", "data:")):
        return None, None
    parts = urlsplit(raw)
    if parts.scheme in {"http", "https"}:
        if parts.netloc not in {PUBLIC_HOST, LEGACY_HOST, f"www.{PUBLIC_HOST}"}:
            return None, None
        path = parts.path
    elif parts.scheme or parts.netloc:
        return None, None
    else:
        path = parts.path
    fragment = unquote(parts.fragment) if parts.fragment else None
    if path == "":
        return source, fragment
    if path.startswith("/"):
        target = ROOT / path.lstrip("/")
    else:
        target = source.parent / path
    target = Path(re.sub(r"/+", "/", str(target))).resolve()
    try:
        target.relative_to(ROOT.resolve())
    except ValueError:
        return target, fragment
    if target.is_dir():
        target = target / "index.html"
    return target, fragment


def parse_page(path: Path) -> PageParser:
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8", errors="replace"))
    return parser


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []
    pages = sorted(p for p in ROOT.rglob("*.html") if ".git" not in p.parts)
    parsed: dict[Path, PageParser] = {}

    for page in pages:
        parser = parse_page(page)
        parsed[page.resolve()] = parser
        rel = page.relative_to(ROOT)
        if page.name not in {"404.html", "thank-you.html"}:
            if parser.h1_count != 1:
                errors.append(f"{rel}: expected 1 H1, found {parser.h1_count}")
            if not parser.meta_description:
                warnings.append(f"{rel}: no meta description")
            if parser.canonical:
                host = urlsplit(parser.canonical).netloc
                if host and host != PUBLIC_HOST:
                    warnings.append(f"{rel}: canonical still uses {host}")
        for attr, raw, attrs in parser.links:
            if raw.startswith("#"):
                fragment = unquote(raw[1:])
                if fragment and fragment not in parser.ids:
                    errors.append(f"{rel}: broken same-page fragment {raw}")
                continue
            target, fragment = local_target(page.resolve(), raw)
            if target is not None:
                if not target.exists():
                    errors.append(f"{rel}: broken local {attr} {raw} -> {target.relative_to(ROOT) if str(target).startswith(str(ROOT)) else target}")
                elif fragment and target.suffix.lower() == ".html":
                    target_parser = parsed.get(target.resolve()) or parse_page(target)
                    parsed[target.resolve()] = target_parser
                    if fragment not in target_parser.ids:
                        errors.append(f"{rel}: missing fragment #{fragment} in {target.relative_to(ROOT)}")
            if attrs.get("target") == "_blank" and raw.startswith(("http://", "https://")):
                rel_tokens = set(attrs.get("rel", "").split())
                if "noopener" not in rel_tokens:
                    errors.append(f"{rel}: external _blank link missing noopener: {raw}")

    sitemap = ROOT / "sitemap.xml"
    if not sitemap.exists():
        errors.append("sitemap.xml is missing")
    else:
        tree = ET.parse(sitemap)
        ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        sitemap_urls = [n.text.strip() for n in tree.findall("sm:url/sm:loc", ns) if n.text]
        for url in sitemap_urls:
            parts = urlsplit(url)
            if parts.netloc != PUBLIC_HOST:
                errors.append(f"sitemap uses non-canonical host: {url}")
                continue
            path = parts.path
            target = ROOT / (path.lstrip("/") or "index.html")
            if path.endswith("/"):
                target = target / "index.html" if path != "/" else ROOT / "index.html"
            if not target.exists():
                errors.append(f"sitemap URL has no file: {url}")

    robots = (ROOT / "robots.txt").read_text(encoding="utf-8", errors="replace") if (ROOT / "robots.txt").exists() else ""
    if f"Sitemap: https://{PUBLIC_HOST}/sitemap.xml" not in robots:
        errors.append("robots.txt does not point to the canonical sitemap")

    print(f"Checked {len(pages)} HTML pages.")
    if warnings:
        print("\nWarnings:")
        for item in warnings:
            print(f"  - {item}")
    if errors:
        print("\nErrors:")
        for item in errors:
            print(f"  - {item}")
        return 1
    print("\nAll internal-link and structural checks passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
