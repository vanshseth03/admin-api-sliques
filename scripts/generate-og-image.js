const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// OG Image dimensions (standard for social media)
const WIDTH = 1200;
const HEIGHT = 630;

// Colors from theme
const IVORY = '#FBF9F6';
const CHARCOAL = '#111317';
const GOLD = '#C9A227';

// Create SVG for the OG image with logo design
const createOGImageSVG = () => {
  return `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#B58E52"/>
          <stop offset="100%" style="stop-color:#D4B88A"/>
        </linearGradient>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FBF9F6"/>
          <stop offset="100%" style="stop-color:#F0EDE8"/>
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGradient)"/>
      
      <!-- Decorative gold accent circles -->
      <circle cx="0" cy="0" r="200" fill="${GOLD}" opacity="0.08"/>
      <circle cx="${WIDTH}" cy="${HEIGHT}" r="250" fill="${GOLD}" opacity="0.06"/>
      
      <!-- Scissors icon (SVG path instead of emoji) -->
      <g transform="translate(${WIDTH/2 - 40}, 120)">
        <path d="M 20 0 C 30 0 40 10 40 20 C 40 30 30 40 20 40 C 10 40 0 30 0 20 C 0 10 10 0 20 0 M 60 0 C 70 0 80 10 80 20 C 80 30 70 40 60 40 C 50 40 40 30 40 20 C 40 10 50 0 60 0 M 20 40 L 60 80 M 60 40 L 20 80" 
              stroke="${GOLD}" stroke-width="4" fill="none" stroke-linecap="round"/>
      </g>
      
      <!-- Brand Name - SLIQUES -->
      <text 
        x="${WIDTH/2}" 
        y="320" 
        font-family="Georgia, serif" 
        font-size="120" 
        font-weight="600" 
        fill="${CHARCOAL}" 
        text-anchor="middle"
        letter-spacing="15"
      >SLIQUES</text>
      
      <!-- Gold Underline -->
      <rect x="${WIDTH/2 - 150}" y="345" width="300" height="4" fill="url(#goldGradient)" rx="2"/>
      
      <!-- Tagline -->
      <text 
        x="${WIDTH/2}" 
        y="410" 
        font-family="Arial, sans-serif" 
        font-size="28" 
        fill="${GOLD}" 
        text-anchor="middle"
        letter-spacing="8"
      >BOUTIQUE TAILORING</text>
      
      <!-- Description -->
      <text 
        x="${WIDTH/2}" 
        y="480" 
        font-family="Arial, sans-serif" 
        font-size="24" 
        fill="${CHARCOAL}" 
        fill-opacity="0.7"
        text-anchor="middle"
      >Tailoring at Your Doorstep</text>
      
      <!-- Services -->
      <text 
        x="${WIDTH/2}" 
        y="530" 
        font-family="Arial, sans-serif" 
        font-size="18" 
        fill="${CHARCOAL}" 
        fill-opacity="0.5"
        text-anchor="middle"
        letter-spacing="3"
      >Custom Outfits - Bridal Wear - Ethnic Wear - Free Pickup and Delivery</text>
      
      <!-- Location badge -->
      <rect x="${WIDTH/2 - 130}" y="560" width="260" height="40" fill="${CHARCOAL}" rx="20"/>
      <text 
        x="${WIDTH/2}" 
        y="587" 
        font-family="Arial, sans-serif" 
        font-size="16" 
        fill="${IVORY}" 
        text-anchor="middle"
        letter-spacing="2"
      >RAJ NAGAR EXTENSION</text>
    </svg>
  `;
};

async function generateOGImage() {
  const outputPath = path.join(__dirname, '..', 'public', 'og-image.png');
  
  console.log('🎨 Generating OG image with SLIQUES logo...');
  
  const svgBuffer = Buffer.from(createOGImageSVG());
  
  await sharp(svgBuffer)
    .png()
    .toFile(outputPath);
  
  const stats = fs.statSync(outputPath);
  console.log(`✅ OG image generated: ${outputPath}`);
  console.log(`📏 Size: ${(stats.size / 1024).toFixed(1)} KB`);
  console.log(`📐 Dimensions: ${WIDTH}x${HEIGHT}`);
}

generateOGImage().catch(err => {
  console.error('❌ Error generating OG image:', err);
  process.exit(1);
});
