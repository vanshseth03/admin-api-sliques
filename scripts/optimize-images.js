const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Directories to process
const imageFolders = [
  { input: '../src/images needed', output: '../src/images-optimized' },
  { input: '../src/neck pics', output: '../src/neck-pics-optimized' }
];

async function optimizeImages() {
  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const folder of imageFolders) {
    const inputDir = path.join(__dirname, folder.input);
    const outputDir = path.join(__dirname, folder.output);

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Get all PNG files
    const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.png'));

    console.log(`\nProcessing ${folder.input}: ${files.length} images...\n`);

    for (const file of files) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file.replace('.png', '.webp'));

      const originalStats = fs.statSync(inputPath);
      totalOriginal += originalStats.size;

      try {
        await sharp(inputPath)
          .resize(800, 600, { // Resize to max dimensions while maintaining aspect ratio
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ quality: 80 }) // Convert to WebP with 80% quality
          .toFile(outputPath);

        const newStats = fs.statSync(outputPath);
        totalOptimized += newStats.size;

        const savings = ((1 - newStats.size / originalStats.size) * 100).toFixed(1);
        console.log(`✓ ${file} → ${file.replace('.png', '.webp')}`);
        console.log(`  ${(originalStats.size / 1024).toFixed(0)}KB → ${(newStats.size / 1024).toFixed(0)}KB (${savings}% smaller)\n`);
      } catch (err) {
        console.error(`✗ Error processing ${file}:`, err.message);
      }
    }
  }

  console.log('='.repeat(50));
  console.log(`Total: ${(totalOriginal / 1024 / 1024).toFixed(1)}MB → ${(totalOptimized / 1024 / 1024).toFixed(1)}MB`);
  console.log(`Overall savings: ${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%`);
  console.log('\nOptimized images saved to: src/images-optimized/ and src/neck-pics-optimized/');
}

optimizeImages().catch(console.error);
