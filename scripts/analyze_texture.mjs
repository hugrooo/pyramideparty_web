import sharp from 'sharp';

async function analyze() {
  const { data, info } = await sharp('public/original_texture.png')
    .raw()
    .toBuffer({ resolveWithObject: true });
    
  let minX = info.width, maxX = 0, minY = info.height, maxY = 0;
  
  // Find bounding box of anything that is NOT close to black/white background
  // Or let's just find the center of non-transparent pixels if it has alpha
  const hasAlpha = info.channels === 4;
  
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * info.channels;
      const r = data[idx];
      const g = data[idx+1];
      const b = data[idx+2];
      const a = hasAlpha ? data[idx+3] : 255;
      
      // Assume the background might be solid white or black.
      // Let's look for colors (difference between rgb)
      const maxColor = Math.max(r, g, b);
      const minColor = Math.min(r, g, b);
      const isColored = (maxColor - minColor) > 20; // some color saturation
      
      if (a > 10 && isColored) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  
  console.log(`Color Bounding Box: minX=${minX}, maxX=${maxX}, minY=${minY}, maxY=${maxY}`);
  console.log(`Center: X=${(minX+maxX)/2}, Y=${(minY+maxY)/2}`);
  console.log(`Width: ${maxX - minX}, Height: ${maxY - minY}`);
}

analyze().catch(console.error);
