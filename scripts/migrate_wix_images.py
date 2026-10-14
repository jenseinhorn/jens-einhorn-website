#!/usr/bin/env python3
import json, pathlib, re, urllib.request

root = pathlib.Path(__file__).resolve().parents[1]
content_dir = root / "content" / "projects"
upload_dir = root / "assets" / "uploads"
upload_dir.mkdir(parents=True, exist_ok=True)

changed_files = 0
downloaded = 0

for path in sorted(content_dir.glob("*.json")):
    data = json.loads(path.read_text(encoding="utf-8"))
    changed = False
    groups = []
    if isinstance(data.get("works"), list):
        groups.append(data["works"])
    if isinstance(data.get("installation_views"), list):
        groups.append(data["installation_views"])

    for group in groups:
        for item in group:
            url = item.get("image", "")
            if not isinstance(url, str) or "static.wixstatic.com" not in url:
                continue

            m = re.search(r"/media/([^/?]+)", url)
            if not m:
                continue
            media_id = m.group(1)
            ext = ".jpg"
            for candidate in (".jpg", ".jpeg", ".png", ".webp"):
                if candidate in media_id.lower():
                    ext = candidate
                    break
            safe = re.sub(r"[^A-Za-z0-9_-]+", "_", media_id.split("~")[0])
            filename = f"wix_{safe}{ext}"
            dest = upload_dir / filename

            if not dest.exists():
                req = urllib.request.Request(url, headers={"User-Agent":"Mozilla/5.0"})
                with urllib.request.urlopen(req, timeout=60) as response:
                    dest.write_bytes(response.read())
                downloaded += 1

            item["image"] = f"/assets/uploads/{filename}"
            changed = True

    if changed:
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        changed_files += 1

print(f"Downloaded {downloaded} images; updated {changed_files} project files.")
