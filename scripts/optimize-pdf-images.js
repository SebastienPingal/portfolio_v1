#!/usr/bin/env node
/**
 * Optimizes profile images for PDF export.
 * Creates smaller versions (400px width, 82% quality) to dramatically reduce PDF file size.
 * Requires ImageMagick (convert).
 *
 * Usage: pnpm run optimize-pdf-images
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const PUBLIC_IMG = path.join(__dirname, '../public/img');
const IMAGES = ['seb8.jpg']; // Add more images here if needed

for (const img of IMAGES) {
  const src = path.join(PUBLIC_IMG, img);
  const base = path.basename(img, path.extname(img));
  const ext = path.extname(img);
  const dest = path.join(PUBLIC_IMG, `${base}-pdf${ext}`);

  if (!fs.existsSync(src)) {
    console.warn(`⚠️  Skipping ${img}: file not found`);
    continue;
  }

  try {
    execSync(
      `convert "${src}" -resize 400x -quality 82 "${dest}"`,
      { stdio: 'inherit' }
    );
    const before = fs.statSync(src).size;
    const after = fs.statSync(dest).size;
    const saved = ((1 - after / before) * 100).toFixed(1);
    console.log(`✅ ${img} → ${base}-pdf${ext} (${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB, -${saved}%)`);
  } catch (e) {
    console.error(`❌ Failed to optimize ${img}:`, e.message);
    process.exit(1);
  }
}
