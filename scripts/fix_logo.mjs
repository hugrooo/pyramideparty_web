import sharp from 'sharp';
import { NodeIO } from '@gltf-transform/core';

async function fix() {
  console.log("Reading logo...");
  const { data, info } = await sharp('public/logo.png')
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]; const g = data[i+1]; const b = data[i+2];
    if (r > 240 && g > 240 && b > 240) data[i+3] = 0;
  }

  const transparentLogo = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 }
  }).png().toBuffer();

  const texWidth = 1678;
  const texHeight = 1678;
  const targetBg = { r: 10, g: 10, b: 15, alpha: 255 };

  const halfWidth = texWidth / 2;
  const halfHeight = texHeight;
  
  // Front: Logo
  const scaleX = (halfWidth * 0.9) / info.width;
  const scaleY = (halfHeight * 0.9) / info.height;
  const scale = Math.min(scaleX, scaleY); 
  const newWidth = Math.round(info.width * scale);
  const newHeight = Math.round(info.height * scale);

  const resizedLogo = await sharp(transparentLogo)
    .resize(newWidth, newHeight)
    .toBuffer();

  const leftX = Math.round((halfWidth / 2) - (newWidth / 2));
  const rightX = Math.round(halfWidth + (halfWidth / 2) - (newWidth / 2));
  const topY = Math.round((halfHeight / 2) - (newHeight / 2));

  // Back: Ace of Spades (SVG)
  // We draw a large 'A' and a spade symbol using an SVG string, then convert to Buffer
  const aceSvg = `
    <svg width="${newWidth}" height="${newHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="none" />
      <text x="50%" y="45%" font-family="Arial" font-size="300" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">A</text>
      <text x="50%" y="75%" font-family="Arial" font-size="250" fill="white" text-anchor="middle" dominant-baseline="middle">♠</text>
    </svg>
  `;

  const finalTexture = await sharp({
    create: { width: texWidth, height: texHeight, channels: 4, background: targetBg }
  })
  .composite([
    { input: resizedLogo, left: leftX, top: topY },  // Front: Logo
    { input: Buffer.from(aceSvg), left: Math.round(halfWidth + (halfWidth / 2) - (newWidth / 2)), top: topY }  // Back: Ace
  ])
  .png()
  .toBuffer();

  console.log("Writing to GLB...");
  const io = new NodeIO();
  const document = await io.read('public/card_original.glb');
  const textures = document.getRoot().listTextures();
  
  for (const texture of textures) {
    texture.setImage(finalTexture);
    texture.setMimeType('image/png');
  }

  const materials = document.getRoot().listMaterials();
  for (const material of materials) {
    if (material.getName() === 'base' || material.getBaseColorFactor) {
      material.setBaseColorFactor([1, 1, 1, 1]); 
      material.setAlphaMode('OPAQUE');
    }
  }

  await io.write('public/card.glb', document);
  console.log("Done!");
}

fix().catch(console.error);
