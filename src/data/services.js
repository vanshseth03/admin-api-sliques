// Service data for SLIQUES boutique
// Prices in INR - All services take approx. 1 week
// Since 2000 - Serving Raj Nagar Extension

// Import optimized WebP images (compressed from 80MB to 0.7MB)
import simpleSalwarImg from '../images-optimized/simple salwar suit.webp';
import pantSuitImg from '../images-optimized/pant suit.webp';
import simpleBlouseImg from '../images-optimized/simple blouse.webp';
import liningSalwarImg from '../images-optimized/lining pant suit.webp';
import liningBlouseImg from '../images-optimized/lining blouse.webp';
import paddedBlouseImg from '../images-optimized/paded blousse.webp';
import princessBlouseImg from '../images-optimized/princess cut.webp';
import anarkaliImg from '../images-optimized/anarkali suit.webp';
import coordSetImg from '../images-optimized/coord set.webp';
import sabyasachiImg from '../images-optimized/sabya sachi.webp';
import bridalBlouseImg from '../images-optimized/bridal blouse.webp';
import bridalSuitImg from '../images-optimized/bridal suit.webp';
import jumpSuitImg from '../images-optimized/jump suit.webp';
import gownImg from '../images-optimized/party wear gown.webp';
import fishCutImg from '../images-optimized/fish cut lehnga.webp';
import simplePantImg from '../images-optimized/simple pant.webp';

export const serviceCategories = [
  {
    id: 'simple',
    name: 'Simple Stitching',
    description: 'Clean, well-fitted everyday pieces',
    emoji: '✂️',
    color: 'charcoal',
    services: [
      {
        id: 'simple-salwar',
        name: 'Simple Salwar Suit',
        description: 'Classic salwar suit with clean stitching. Perfect for everyday comfort and casual outings.',
        basePrice: 700,
        estimatedDays: 7,
        requiresAdvance: false,
        image: simpleSalwarImg
      },
      {
        id: 'simple-pant-suit',
        name: 'Simple Pant Suit',
        description: 'Well-tailored pant suit for modern style. Clean cuts and comfortable fit.',
        basePrice: 800,
        estimatedDays: 7,
        requiresAdvance: false,
        image: pantSuitImg
      },
      {
        id: 'simple-blouse',
        name: 'Simple Blouse',
        description: 'Basic blouse stitching with perfect fit. Ideal for regular wear.',
        basePrice: 500,
        estimatedDays: 7,
        requiresAdvance: false,
        image: simpleBlouseImg
      },
      {
        id: 'simple-pant',
        name: 'Simple Pant',
        description: 'Well-fitted simple pants for everyday comfort.',
        basePrice: 400,
        estimatedDays: 7,
        requiresAdvance: false,
        image: simplePantImg
      }
    ]
  },
  {
    id: 'lining',
    name: 'Lining Work',
    description: 'Fully lined outfits for premium comfort and finish',
    emoji: '🧵',
    color: 'gold',
    services: [
      {
        id: 'lining-salwar',
        name: 'Lining Salwar Suit',
        description: 'Salwar suit with complete lining on top only. Premium finish for special occasions.',
        basePrice: 1300,
        estimatedDays: 7,
        requiresAdvance: true,
        image: liningSalwarImg
      },
      {
        id: 'lining-pant-suit',
        name: 'Lining Pant Suit',
        description: 'Complete lining on both top and bottom. Full comfort and elegant drape.',
        basePrice: 1600,
        estimatedDays: 7,
        requiresAdvance: true,
        image: liningSalwarImg
      },
      {
        id: 'lining-blouse',
        name: 'Lining Blouse',
        description: 'Blouse with full inner lining. Smooth finish and comfortable wear.',
        basePrice: 800,
        estimatedDays: 7,
        requiresAdvance: true,
        image: liningBlouseImg
      }
    ]
  },
  {
    id: 'premium-ethnic',
    name: 'Premium Ethnic',
    description: 'Elegant ethnic wear with exquisite finishing',
    emoji: '👘',
    color: 'gold',
    services: [
      {
        id: 'padded-blouse',
        name: 'Padded Blouse',
        description: 'Blouse with professional padding for perfect structure and support.',
        basePrice: 1500,
        estimatedDays: 7,
        requiresAdvance: true,
        image: paddedBlouseImg
      },
      {
        id: 'princess-blouse',
        name: 'Princess Cut Blouse',
        description: 'Flattering princess cut blouses that accentuate your silhouette.',
        basePrice: 1200,
        estimatedDays: 7,
        requiresAdvance: false,
        image: princessBlouseImg
      },
      {
        id: 'anarkali',
        name: 'Anarkali & Sharara',
        description: 'Flowing Anarkalis and elegant Shararas crafted with attention to every pleat.',
        basePrice: 2500,
        estimatedDays: 7,
        requiresAdvance: true,
        image: anarkaliImg
      },
      {
        id: 'coord-set',
        name: 'Co-ord Set',
        description: 'Matching coordinate sets that make styling effortless.',
        basePrice: 1800,
        estimatedDays: 7,
        requiresAdvance: true,
        image: coordSetImg
      },
      {
        id: 'sabyasachi-blouse',
        name: 'Sabyasachi Styled Blouse',
        description: 'Designer-inspired blouses with intricate details and luxurious finishing.',
        basePrice: 2500,
        estimatedDays: 7,
        requiresAdvance: true,
        image: sabyasachiImg
      }
    ]
  },
  {
    id: 'bridal',
    name: 'Bridal & Special',
    description: 'Exquisite bridal wear crafted with care',
    emoji: '👰',
    color: 'wine',
    services: [
      {
        id: 'bridal-blouse',
        name: 'Bridal Blouse',
        description: 'Your dream bridal blouse brought to life. Intricate handwork and perfect fit.',
        basePrice: 2100,
        estimatedDays: 7,
        requiresAdvance: true,
        image: bridalBlouseImg
      },
      {
        id: 'bridal-padded-suit',
        name: 'Bridal Padded Suit',
        description: 'Premium bridal suit with professional padding for perfect structure.',
        basePrice: 2100,
        estimatedDays: 7,
        requiresAdvance: true,
        image: bridalSuitImg
      }
    ]
  },
  {
    id: 'western',
    name: 'Western Wear',
    description: 'Contemporary western silhouettes with expert tailoring',
    emoji: '👗',
    color: 'charcoal',
    services: [
      {
        id: 'jumpsuit',
        name: 'Jump Suit',
        description: 'Stylish jumpsuits tailored to your measurements. Modern and chic.',
        basePrice: 1600,
        estimatedDays: 7,
        requiresAdvance: true,
        image: jumpSuitImg
      },
      {
        id: 'gown',
        name: 'Gown',
        description: 'Elegant gowns for special occasions. Perfect drape and fit.',
        basePrice: 2500,
        estimatedDays: 7,
        requiresAdvance: true,
        image: gownImg
      },
      {
        id: 'fish-cut-lehenga',
        name: 'Fish Cut Lehenga',
        description: 'Stunning fish cut silhouette lehenga for a dramatic look.',
        basePrice: 2500,
        estimatedDays: 7,
        requiresAdvance: true,
        image: fishCutImg
      }
    ]
  },
  {
    id: 'others',
    name: 'Custom & Special Orders',
    description: 'Something unique? Let us craft your vision!',
    emoji: '✨',
    color: 'wine',
    isSpecial: true,
    services: [
      {
        id: 'custom-order',
        name: 'Custom Creation',
        description: 'Have something special in mind? Share your vision with us! Price and timeline will be discussed over WhatsApp or call based on your requirements.',
        basePrice: 0,
        estimatedDays: 0,
        requiresAdvance: true,
        isCustom: true,
        image: null
      }
    ]
  }
];

export const getAllServices = () => {
  return serviceCategories.flatMap(cat => 
    cat.services.map(service => ({
      ...service,
      category: cat.id,
      categoryName: cat.name
    }))
  );
};

export const getServiceById = (id) => {
  return getAllServices().find(s => s.id === id);
};

export const getServicesByCategory = (categoryId) => {
  const category = serviceCategories.find(c => c.id === categoryId);
  return category ? category.services : [];
};

// Check if service requires advance payment
export const requiresAdvancePayment = (serviceId) => {
  const service = getServiceById(serviceId);
  return service?.requiresAdvance || false;
};
