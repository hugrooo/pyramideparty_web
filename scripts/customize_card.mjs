import fs from 'fs';
import { NodeIO } from '@gltf-transform/core';

async function customize() {
  console.log("Loading card.glb...");
  const io = new NodeIO();
  const document = await io.read('public/card.glb');

  console.log("Loading logo.png...");
  const logoBuffer = fs.readFileSync('public/logo.png');
  
  // Replace all textures in the GLB with our logo
  const textures = document.getRoot().listTextures();
  console.log(`Found ${textures.length} textures.`);
  
  for (const texture of textures) {
    texture.setImage(logoBuffer);
    texture.setMimeType('image/png');
  }

  console.log("Writing new card.glb...");
  await io.write('public/card.glb', document);
  
  console.log("Customizing lanyard.png (copying logo)...");
  fs.copyFileSync('public/logo.png', 'public/lanyard.png');

  console.log("Done!");
}

customize().catch(console.error);
