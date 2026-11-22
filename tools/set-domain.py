#!/usr/bin/env python3
"""Сайттын дарегин өзгөртүү + sitemap.xml жана robots.txt түзүү.

Колдонуу:
  python3 tools/set-domain.py https://samara.kg      # жаңы домен
  python3 tools/set-domain.py                        # учурдагы даректин негизинде кайра түзүү

Эмне кылат: index/davet.html ичиндеги og:image, canonical, JSON-LD даректерин алмаштырат,
sitemap.xml'ди config.js'ден (шаблондор жана видео дизайндар) кайра түзөт, robots.txt'ти жазат.
"""
import re, sys, pathlib, datetime

root = pathlib.Path(__file__).resolve().parent.parent
base_file = root / "tools" / "BASE"
old = base_file.read_text().strip().rstrip("/")
new = (sys.argv[1] if len(sys.argv) > 1 else old).strip().rstrip("/")
if not re.match(r"^https?://[a-z0-9.-]+(/[\w.-]+)*$", new, re.I):
    sys.exit("Дарек туура эмес: " + new)

# 1. даректерди алмаштыруу
changed = []
for name in ("index.html", "davet.html"):
    p = root / name
    s = p.read_text()
    s2 = s.replace(old, new)
    if s2 != s:
        p.write_text(s2); changed.append(name)

# 2. sitemap.xml
cfg = (root / "js" / "config.js").read_text()
def ids(block):
    m = re.search(block + r":\s*\[(.*?)\n  \]", cfg, re.S)
    return re.findall(r'\bid:\s*"([a-z0-9-]+)"', m.group(1)) if m else []
templates, videos = ids("templates"), ids("videos")
today = datetime.date.today().isoformat()
urls = [("", "1.0"), ("texts.html", "0.6"), ("terms.html", "0.3"), ("privacy.html", "0.3")]
urls += [("design.html?id=" + i, "0.8") for i in templates]
urls += [("design.html?k=video&amp;id=" + i, "0.8") for i in videos]
xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for path, pr in urls:
    xml.append("  <url><loc>%s/%s</loc><lastmod>%s</lastmod><priority>%s</priority></url>" % (new, path, today, pr))
xml.append("</urlset>")
(root / "sitemap.xml").write_text("\n".join(xml) + "\n")

# 3. robots.txt. admin/davet/video барактары <meta name="robots" content="noindex"> менен жабылган:
#    аларды robots.txt менен тыйбайбыз, антпесе Google noindex белгисин көрбөйт.
(root / "robots.txt").write_text(
    "User-agent: *\nAllow: /\nDisallow: /data/\n\nSitemap: %s/sitemap.xml\n" % new)

base_file.write_text(new + "\n")
print("Дарек: %s -> %s" % (old, new))
print("Жаңыланган файлдар:", ", ".join(changed) or "(өзгөрүү жок)", "| sitemap.xml: %d дарек | robots.txt" % len(urls))
