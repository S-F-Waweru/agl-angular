#!/usr/bin/env bash
# Prepares AGL project photos for the website:
#  1. keeps untouched originals in assets/originals/ (outside public/, never shipped)
#  2. converts .jfif -> .jpg and renames everything to URL-friendly slugs
#  3. resizes to web width and re-encodes, then runs a LOSSLESS jpegtran pass
set -euo pipefail
cd "$(dirname "$0")/.."

IMG=public/images
SRC=assets/originals      # master copies live here
WEB_MAX=1600          # max width for full-width service photos
CARD_MAX=900          # max width for showroom card / lightbox photos

mkdir -p "$SRC"

# original -> web name
declare -A MAP=(
  ["Aluminium frame office partitioning.jpg"]="aluminium-frame-office-partitioning.jpg"
  ["Office partitioning.jpeg"]="office-partitioning.jpg"
  ["office partitioning.jpg"]="frameless-office-partitioning.jpg"
  ["frameless office partitioning.jpg"]="office-partitioning-frameless.jpg"
  ["aluminium frame shower cubicle.jfif"]="aluminium-frame-shower-cubicle.jpg"
  ["frameless shower cubicle.jfif"]="frameless-shower-cubicle.jpg"
  ["shop front glazing.jpg"]="shopfront-glazing.jpg"
  ["structal facade.jpg"]="structural-facade.jpg"
  ["spider fitted glass wall.jpg"]="spider-fitted-glass-wall.jpg"
  ["Balustrade.jpeg"]="balustrade.jpg"
  ["stainless steel handrill.jpg"]="stainless-steel-handrail.jpg"
)

# web name -> max width
declare -A WIDTH=(
  ["aluminium-frame-office-partitioning.jpg"]=$WEB_MAX
  ["office-partitioning.jpg"]=$WEB_MAX
  ["frameless-office-partitioning.jpg"]=$WEB_MAX
  ["office-partitioning-frameless.jpg"]=$CARD_MAX
  ["aluminium-frame-shower-cubicle.jpg"]=$WEB_MAX
  ["frameless-shower-cubicle.jpg"]=$WEB_MAX
  ["shopfront-glazing.jpg"]=$WEB_MAX
  ["structural-facade.jpg"]=$WEB_MAX
  ["spider-fitted-glass-wall.jpg"]=$CARD_MAX
  ["balustrade.jpg"]=$WEB_MAX
  ["stainless-steel-handrail.jpg"]=$WEB_MAX
)

for src in "${!MAP[@]}"; do
  dst="${MAP[$src]}"
  max="${WIDTH[$dst]}"
  # pick up any newly dropped originals from either location
  if [ -f "$IMG/$src" ] && [ ! -f "$SRC/$src" ]; then mv -n "$IMG/$src" "$SRC/$src"; fi
  [ -f "$SRC/$src" ] || { echo "MISSING: $src"; continue; }
  magick "$SRC/$src" \
    -auto-orient \
    -resize "${max}>" \
    -strip \
    -interlace Plane \
    -quality 85 \
    -define jpeg:retain-settings \
    "jpg:$IMG/$dst"
  # lossless optimisation pass (same DCT coefficients, smaller container)
  jpegtran -optimize -progressive -copy none \
    -outfile "$IMG/$dst.tmp" "$IMG/$dst" && mv "$IMG/$dst.tmp" "$IMG/$dst"
  printf '%-42s %s -> %s\n' "$src" "$(identify -format '%wx%h %b' "$IMG/$dst")" "$dst"
done

echo "Done."
