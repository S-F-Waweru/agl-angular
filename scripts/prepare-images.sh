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
  # showroom additions dropped into assets/originals/
  ["Shower Cubicle.jpeg"]="shower-cubicle.jpg"
  ["Office Partitioning IZWOF.jpeg"]="office-partitioning-izwof.jpg"
  ["WhatsApp Image 2026-10-29 at 10.57.19 (4).jpeg"]="office-reception-glass-wall.jpg"
  ["Residential curtain wall.jpeg"]="residential-curtain-wall.jpg"
  ["Curtain wall town house.jpeg"]="curtain-wall-town-house.jpg"
  ["Frameless Swing door.jpeg"]="frameless-swing-door.jpg"
  ["Stairs balustrade.jpeg"]="stairs-balustrade.jpg"
  ["Sliding window, balcony balustrade.jpeg"]="sliding-window-balcony-balustrade.jpg"
  ["Projected window.jpeg"]="projected-windows.jpg"
  ["Sliding Windows town house.jpeg"]="sliding-windows-town-house-row.jpg"
  ["Sliding windows town housee.jpeg"]="sliding-windows-town-house-detail.jpg"
  ["WhatsApp Image 2026-10-29 at 10.57.19 (3).jpeg"]="sliding-windows-residential.jpg"
  ["sliding window.jpeg"]="sliding-window-town-house.jpg"
  ["pegola.jpeg"]="glass-pergola-canopy.jpg"
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
  # showroom cards only — the 4/3 crop never needs more than the card width
  ["shower-cubicle.jpg"]=$CARD_MAX
  ["office-partitioning-izwof.jpg"]=$CARD_MAX
  ["office-reception-glass-wall.jpg"]=$CARD_MAX
  ["residential-curtain-wall.jpg"]=$CARD_MAX
  ["curtain-wall-town-house.jpg"]=$CARD_MAX
  ["frameless-swing-door.jpg"]=$CARD_MAX
  ["stairs-balustrade.jpg"]=$CARD_MAX
  ["sliding-window-balcony-balustrade.jpg"]=$CARD_MAX
  ["projected-windows.jpg"]=$CARD_MAX
  ["sliding-windows-town-house-row.jpg"]=$CARD_MAX
  ["sliding-windows-town-house-detail.jpg"]=$CARD_MAX
  ["sliding-windows-residential.jpg"]=$CARD_MAX
  ["sliding-window-town-house.jpg"]=$CARD_MAX
  ["glass-pergola-canopy.jpg"]=$CARD_MAX
)

# web name -> "WxH+X+Y" crop applied before resizing (only where the original needs trimming)
declare -A CROP=(
  # the shot carries a camera watermark band along the bottom edge
  ["frameless-swing-door.jpg"]="1280x500+0+90"
)

for src in "${!MAP[@]}"; do
  dst="${MAP[$src]}"
  max="${WIDTH[$dst]}"
  crop=( )
  [ -n "${CROP[$dst]:-}" ] && crop=(-crop "${CROP[$dst]}" +repage)
  # pick up any newly dropped originals from either location
  if [ -f "$IMG/$src" ] && [ ! -f "$SRC/$src" ]; then mv -n "$IMG/$src" "$SRC/$src"; fi
  [ -f "$SRC/$src" ] || { echo "MISSING: $src"; continue; }
  magick "$SRC/$src" \
    -auto-orient \
    ${crop[@]+"${crop[@]}"} \
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
