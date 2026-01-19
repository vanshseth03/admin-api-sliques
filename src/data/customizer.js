// Customizer options for the outfit customizer feature
// Pricing rules:
// - Lining doubles the base price
// - Padding doubles the base price  
// - Both lining + padding = 3x the base price
// - Neck, sleeves, length options are FREE

// Import optimized WebP images
import simpleBlouseImg from '../images-optimized/simple blouse.webp';
import simpleSalwarImg from '../images-optimized/simple salwar suit.webp';
import simplePantImg from '../images-optimized/simple pant.webp';
import liningBlouseImg from '../images-optimized/lining blouse.webp';
import liningSalwarImg from '../images-optimized/lining pant suit.webp';
import paddedBlouseImg from '../images-optimized/paded blousse.webp';
import princessBlouseImg from '../images-optimized/princess cut.webp';
import anarkaliImg from '../images-optimized/anarkali suit.webp';
import coordSetImg from '../images-optimized/coord set.webp';
import sabyasachiImg from '../images-optimized/sabya sachi.webp';
import bridalBlouseImg from '../images-optimized/bridal blouse.webp';
import jumpSuitImg from '../images-optimized/jump suit.webp';
import gownImg from '../images-optimized/party wear gown.webp';
import fishCutImg from '../images-optimized/fish cut lehnga.webp';

// Import optimized neck design images
import roundNeckImg from '../neck-pics-optimized/round neck.webp';
import vNeckImg from '../neck-pics-optimized/v neck.webp';
import squareNeckImg from '../neck-pics-optimized/square neck.webp';
import boatNeckImg from '../neck-pics-optimized/boat.webp';
import sweetheartNeckImg from '../neck-pics-optimized/sweetheart.webp';
import decolletteNeckImg from '../neck pics/decollete.png';
import keyholeNeckImg from '../neck pics/keyhole.png';
import halterNeckImg from '../neck pics/halter.png';
import offShoulderNeckImg from '../neck pics/off soulder.png';

export const baseOutfits = [
  {
    id: 'simple-blouse',
    name: 'Simple Blouse',
    basePrice: 500,
    image: simpleBlouseImg,
    description: 'Basic blouse - perfect canvas for customization'
  },
  {
    id: 'simple-salwar',
    name: 'Simple Salwar Suit',
    basePrice: 700,
    image: simpleSalwarImg,
    description: 'Classic salwar suit with clean stitching'
  },
  {
    id: 'simple-pant-suit',
    name: 'Simple Pant Suit',
    basePrice: 800,
    image: simplePantImg,
    description: 'Well-tailored pant suit for modern style'
  },
  {
    id: 'lining-blouse',
    name: 'Lining Blouse',
    basePrice: 800,
    image: liningBlouseImg,
    description: 'Blouse with full inner lining',
    requiresAdvance: true
  },
  {
    id: 'lining-salwar',
    name: 'Lining Salwar Suit',
    basePrice: 1300,
    image: liningSalwarImg,
    description: 'Salwar suit with lining on top',
    requiresAdvance: true
  },
  {
    id: 'lining-pant-suit',
    name: 'Lining Pant Suit',
    basePrice: 1600,
    image: liningSalwarImg,
    description: 'Complete lining on both top and bottom',
    requiresAdvance: true
  },
  {
    id: 'padded-blouse',
    name: 'Padded Blouse',
    basePrice: 1500,
    image: paddedBlouseImg,
    description: 'Blouse with professional padding',
    requiresAdvance: true
  },
  {
    id: 'princess-blouse',
    name: 'Princess Cut Blouse',
    basePrice: 1200,
    image: princessBlouseImg,
    description: 'Flattering princess cut design'
  },
  {
    id: 'anarkali',
    name: 'Anarkali & Sharara',
    basePrice: 2500,
    image: anarkaliImg,
    description: 'Flowing Anarkali or elegant Sharara',
    requiresAdvance: true
  },
  {
    id: 'coord-set',
    name: 'Co-ord Set',
    basePrice: 1800,
    image: coordSetImg,
    description: 'Matching top and bottom set',
    requiresAdvance: true
  },
  {
    id: 'sabyasachi-blouse',
    name: 'Sabyasachi Styled Blouse',
    basePrice: 2500,
    image: sabyasachiImg,
    description: 'Designer-inspired luxury blouse',
    requiresAdvance: true
  },
  {
    id: 'bridal-blouse',
    name: 'Bridal Blouse',
    basePrice: 2100,
    image: bridalBlouseImg,
    description: 'Your dream bridal blouse',
    requiresAdvance: true
  },
  {
    id: 'bridal-padded-suit',
    name: 'Bridal Padded Suit',
    basePrice: 2100,
    image: bridalBlouseImg,
    description: 'Premium bridal suit with padding',
    requiresAdvance: true
  },
  {
    id: 'jumpsuit',
    name: 'Jump Suit',
    basePrice: 1600,
    image: jumpSuitImg,
    description: 'Modern and chic jumpsuit',
    requiresAdvance: true
  },
  {
    id: 'gown',
    name: 'Gown',
    basePrice: 2500,
    image: gownImg,
    description: 'Elegant gown for special occasions',
    requiresAdvance: true
  },
  {
    id: 'fish-cut-lehenga',
    name: 'Fish Cut Lehenga',
    basePrice: 2500,
    image: fishCutImg,
    description: 'Stunning fish cut silhouette',
    requiresAdvance: true
  }
];

// All neck designs are FREE
export const neckDesigns = [
  {
    id: 'round',
    name: 'Round Neck',
    price: 0,
    image: roundNeckImg,
    description: 'Classic round neckline'
  },
  {
    id: 'v-neck',
    name: 'V-Neck',
    price: 0,
    image: vNeckImg,
    description: 'Elegant V-shaped neckline'
  },
  {
    id: 'square',
    name: 'Square Neck',
    price: 0,
    image: squareNeckImg,
    description: 'Modern square neckline'
  },
  {
    id: 'boat',
    name: 'Boat Neck',
    price: 0,
    image: boatNeckImg,
    description: 'Wide horizontal neckline'
  },
  {
    id: 'sweetheart',
    name: 'Sweetheart',
    price: 0,
    image: sweetheartNeckImg,
    description: 'Romantic heart-shaped neckline'
  },
  {
    id: 'decollete',
    name: 'Decollete',
    price: 0,
    image: decolletteNeckImg,
    description: 'Low-cut elegant neckline'
  },
  {
    id: 'keyhole',
    name: 'Keyhole',
    price: 0,
    image: keyholeNeckImg,
    description: 'Keyhole cutout neckline'
  },
  {
    id: 'halter',
    name: 'Halter',
    price: 0,
    image: halterNeckImg,
    description: 'Strap around neck style'
  },
  {
    id: 'off-shoulder',
    name: 'Off-Shoulder',
    price: 0,
    image: offShoulderNeckImg,
    description: 'Elegant off-shoulder style'
  },
  {
    id: 'custom',
    name: 'Custom Design',
    price: 0,
    image: null,
    description: 'Upload your own design - Complimentary!'
  }
];

// All sleeve styles are FREE
export const sleeveStyles = [
  {
    id: 'sleeveless',
    name: 'Sleeveless',
    price: 0,
    description: 'No sleeves'
  },
  {
    id: 'cap',
    name: 'Cap Sleeves',
    price: 0,
    description: 'Short cap covering shoulders'
  },
  {
    id: 'short',
    name: 'Short Sleeves',
    price: 0,
    description: 'Above elbow length'
  },
  {
    id: 'elbow',
    name: 'Elbow Length',
    price: 0,
    description: 'Till elbow'
  },
  {
    id: 'three-quarter',
    name: '3/4 Sleeves',
    price: 0,
    description: 'Three-quarter length'
  },
  {
    id: 'full',
    name: 'Full Sleeves',
    price: 0,
    description: 'Full arm length'
  },
  {
    id: 'bell',
    name: 'Bell Sleeves',
    price: 0,
    description: 'Flared bell shape'
  },
  {
    id: 'puff',
    name: 'Puff Sleeves',
    price: 0,
    description: 'Gathered puff style'
  }
];

// Add-ons (can select multiple)
export const addOns = [
  {
    id: 'piping',
    name: 'Piping Work',
    price: 100,
    description: 'Decorative piping along edges'
  },
  {
    id: 'tassels',
    name: 'Tassels/Latkans',
    price: 200,
    description: 'Tassels or latkans attached to the outfit'
  }
];

// All fit options are FREE
export const fitOptions = [
  {
    id: 'loose',
    name: 'Loose Fit',
    priceAdjustment: 0,
    description: 'Relaxed and comfortable'
  },
  {
    id: 'regular',
    name: 'Regular Fit',
    priceAdjustment: 0,
    description: 'Standard comfortable fit'
  },
  {
    id: 'slim',
    name: 'Slim Fit',
    priceAdjustment: 0,
    description: 'Tailored close fit'
  },
  {
    id: 'body',
    name: 'Body Fit',
    priceAdjustment: 0,
    description: 'Form-fitting silhouette'
  }
];

// Check if outfit requires advance payment
export const requiresAdvancePayment = (outfitId) => {
  const outfit = baseOutfits.find(o => o.id === outfitId);
  return outfit?.requiresAdvance || false;
};
