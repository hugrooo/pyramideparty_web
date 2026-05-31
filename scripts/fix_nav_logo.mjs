import sharp from 'sharp';
import fs from 'fs';

async function fixNavLogo() {
  console.log("Removing white background from nav logo...");
  const { data, info } = await sharp('public/logo.png')
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]; const g = data[i+1]; const b = data[i+2];
    if (r > 230 && g > 230 && b > 230) {
      data[i+3] = 0;
    }
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 }
  })
  .png()
  .toFile('public/logo_temp.png');
  
  fs.copyFileSync('public/logo_temp.png', 'public/logo.png');
  fs.unlinkSync('public/logo_temp.png');

  console.log("Nav logo fixed!");
}

fixNavLogo().catch(console.error);
