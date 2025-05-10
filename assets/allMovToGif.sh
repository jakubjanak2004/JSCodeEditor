for f in *.mov; do
  name="${f%.mov}"

  # 1. Generate color palette at full resolution
  ffmpeg -y -i "$f" -vf "fps=10,palettegen" "${name}_palette.png"

  # 2. Use palette to generate high-quality full-res GIF
  ffmpeg -i "$f" -i "${name}_palette.png" -filter_complex \
    "fps=10[x];[x][1:v]paletteuse" \
    "${name}.gif"

  # Cleanup
  rm "${name}_palette.png"
done
