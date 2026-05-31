import fs from 'fs';
import { NodeIO } from '@gltf-transform/core';

async function extract() {
  const io = new NodeIO();
  const document = await io.read('public/card_original.glb');
  const textures = document.getRoot().listTextures();
  if (textures.length > 0) {
    const img = textures[0].getImage();
    fs.writeFileSync('public/original_texture.png', img);
    console.log("Extracted original_texture.png");
  }
}

extract().catch(console.error);
