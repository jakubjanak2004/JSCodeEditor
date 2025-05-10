for f in *.mov; do
  name="${f%.mov}"

  # 1. Generate color palette
  ffmpeg -y -i "$f" -vf "fps=10,scale=480:-1:flags=lanczos,palettegen" "${name}_palette.png"

  # 2. Use palette to generate high-quality GIF
  ffmpeg -i "$f" -i "${name}_palette.png" -filter_complex \
    "fps=10,scale=480:-1:flags=lanczos[x];[x][1:v]paletteuse" \
    "${name}.gif"

  # Optional: remove temporary palette file
  rm "${name}_palette.png"
done