#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
shopt -s nullglob
FILES=(
  "$ROOT/index.html"
  "$ROOT/404.html"
  "$ROOT/assets/index-"*.js
  "$ROOT/assets/index-"*.css
)

echo "Fixing ${#FILES[@]} files..."
for f in "${FILES[@]}"; do
  [ -f "$f" ] || continue

  # 1) Core asset dirs: "/assets|/icons|/fonts|/models|/shaders" → "./..."
  perl -0777 -i -pe 's#\"/(assets|icons|fonts|models|shaders)/#\"./$1/#g' "$f"
  perl -0777 -i -pe 's#\x27/(assets|icons|fonts|models|shaders)/#\x27./$1/#g' "$f"
  perl -0777 -i -pe 's#\x60/(assets|icons|fonts|models|shaders)/#\x60./$1/#g' "$f"

  # 2) Top-level images: "/foo.png" → "./foo.png"
  perl -0777 -i -pe 's#\"/([A-Za-z0-9._-]+\.(png|jpg|jpeg|gif|svg|webp|ico))#\"./$1#g' "$f"
  perl -0777 -i -pe 's#\x27/([A-Za-z0-9._-]+\.(png|jpg|jpeg|gif|svg|webp|ico))#\x27./$1#g' "$f"
  perl -0777 -i -pe 's#\x60/([A-Za-z0-9._-]+\.(png|jpg|jpeg|gif|svg|webp|ico))#\x60./$1#g' "$f"

  # 3) CSS font urls: url(/fonts/...) → url(./fonts/...)
  perl -0777 -i -pe 's#url\(\s*/(fonts/)#url(./$1#g' "$f"

  # 4) Fix history.pushState and similar navigation to use relative paths
  perl -0777 -i -pe 's#pushState\(([^)]*),\s*(['\''"])(/)\2#pushState($1,$2./$2#g' "$f"
  perl -0777 -i -pe 's#replaceState\(([^)]*),\s*(['\''"])(/)\2#replaceState($1,$2./$2#g' "$f"

  # 5) Only fix obvious double-path issues that might have been created
  perl -0777 -i -pe 's#\./shaders/shaders/#./shaders/#g' "$f"
  perl -0777 -i -pe 's#shaders/shaders/#shaders/#g' "$f"

done

echo "Verify remaining issues:"
echo "Root-absolute asset paths:"
grep -RnoE "['\"]/((assets|icons|fonts|models|shaders))/" "$ROOT" | head -20 || true
echo "CSS font URLs:"
grep -RnoE "url\(\s*/fonts/" "$ROOT" | head -20 || true
echo "Root-absolute images:"
grep -RnoE "['\"]/[^'\"()]+\.(png|jpg|jpeg|gif|svg|webp|ico)" "$ROOT" | head -20 || true
echo "Double shaders paths:"
grep -RnoE "shaders/shaders" "$ROOT" | head -20 || true
echo "History pushState/replaceState with root paths:"
grep -RnoE "(pushState|replaceState)\([^)]*['\"]\/['\"]" "$ROOT" | head -20 || true
echo "Done."