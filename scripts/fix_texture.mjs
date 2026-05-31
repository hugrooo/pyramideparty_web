import fs from 'fs';
import sharp from 'sharp';
import { NodeIO } from '@gltf-transform/core';

async function fixTexture() {
  console.log("Loading logo.png...");
  const image = sharp('public/logo.png');
  const metadata = await image.metadata();
  
  // The React logo in the original card.glb is likely padded and centered.
  // We will create a square canvas (e.g., 1024x1024), fully transparent,
  // and composite the logo onto the center of it, scaled down to 50% or 60%.
  
  const targetSize = Math.max(metadata.width, metadata.height) * 2; 
  // Make the canvas 2x the size of the logo to add lots of padding
  // This will "shrink" the logo relatively.
  
  console.log("Generating padded texture...");
  const paddedLogoBuffer = await sharp({
    create: {
      width: targetSize,
      height: targetSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
    }
  })
  .composite([{
    input: await image.toBuffer(),
    gravity: 'center'
  }])
  .png()
  .toBuffer();

  // Also let's try to remove white borders from the image if it's not transparent?
  // We can't perfectly remove white without a threshold mask, but let's assume it's transparent.
  // If the user means the 3D card *itself* has a white border around the mesh...
  // In `Lanyard.tsx`, we saw `<meshPhysicalMaterial map={materials.base.map} ... />`.
  // Wait, the materials in the card.glb might have a base color factor that is white [1,1,1,1].
  
  console.log("Loading card.glb (from original if we had it? We overwrote it.)");
  // We already overwrote card.glb, so we read it again.
  const io = new NodeIO();
  const document = await io.read('public/card.glb');
  
  console.log("Updating textures and materials...");
  const textures = document.getRoot().listTextures();
  for (const texture of textures) {
    texture.setImage(paddedLogoBuffer);
    texture.setMimeType('image/png');
  }

  // Set the base color of the material to black or dark so the "white contours" (if they are the card background) disappear.
  const materials = document.getRoot().listMaterials();
  for (const material of materials) {
    if (material.getName() === 'base' || material.getName() === 'Material' || material.getBaseColorFactor) {
      // Set to black or dark gray if transparent
      material.setBaseColorFactor([0.1, 0.1, 0.1, 1]); 
      material.setAlphaMode('BLEND'); // Ensure transparency works
    }
  }

  console.log("Writing fixed card.glb...");
  await io.write('public/card.glb', document);
  console.log("Done!");
}

fixTexture().catch(console.error);
