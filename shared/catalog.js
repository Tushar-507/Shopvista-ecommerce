/**
 * ShopVista shared catalog.
 *
 * This module is intentionally framework-free: the React client uses it for
 * instant rendering and offline fallback, while the Express server uses it to
 * seed MongoDB. Keeping one source of truth keeps demo data consistent.
 */

export const img = (id, width = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

export const categories = [
  {
    slug: 'audio',
    name: 'Audio',
    tagline: 'Sound that surrounds you',
    image: img('1505740420928-5e560c06d30e', 700),
  },
  {
    slug: 'wearables',
    name: 'Wearables',
    tagline: 'Technology on your wrist',
    image: img('1523275335684-37898b6baf30', 700),
  },
  {
    slug: 'gaming',
    name: 'Gaming',
    tagline: 'Built for the next level',
    image: img('1587829741301-dc798b83add3', 700),
  },
  {
    slug: 'cameras',
    name: 'Cameras',
    tagline: 'Capture every detail',
    image: img('1516035069371-29a1b244cc32', 700),
  },
  {
    slug: 'computers',
    name: 'Computers',
    tagline: 'Power to create anywhere',
    image: img('1496181133206-80ce9b88a853', 700),
  },
  {
    slug: 'home',
    name: 'Home & Living',
    tagline: 'Design for everyday living',
    image: img('1567538096630-e0c55bd6374c', 700),
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    tagline: 'The finishing touch',
    image: img('1553062407-98eeb64c6a62', 700),
  },
];

const categoryName = (slug) => categories.find((c) => c.slug === slug)?.name ?? slug;

const product = (data) => ({
  ...data,
  categoryName: categoryName(data.category),
  images: data.gallery.map((id) => img(id)),
  image: img(data.gallery[0]),
});

export const products = [
  product({
    id: 'aurora-anc-headphones',
    slug: 'aurora-anc-headphones',
    name: 'Aurora ANC Headphones',
    category: 'audio',
    price: 249,
    oldPrice: 329,
    rating: 4.8,
    reviews: 1240,
    stock: 32,
    badge: 'Best Seller',
    featured: true,
    bestseller: true,
    gallery: ['1505740420928-5e560c06d30e', '1546435770-a3e426bf472b', '1583394838336-acd977736f90'],
    description:
      'Studio-grade sound with adaptive noise cancelling, plush memory-foam cushions and a battery that outlasts your longest days. Aurora tunes itself to your ears and the world around you.',
    specs: [
      { label: 'Driver', value: '40 mm dynamic' },
      { label: 'Battery life', value: 'Up to 40 hours' },
      { label: 'Noise cancelling', value: 'Adaptive hybrid ANC' },
      { label: 'Connectivity', value: 'Bluetooth 5.3 / USB-C' },
      { label: 'Weight', value: '254 g' },
    ],
  }),
  product({
    id: 'pulse-wireless-earbuds',
    slug: 'pulse-wireless-earbuds',
    name: 'Pulse Wireless Earbuds',
    category: 'audio',
    price: 129,
    oldPrice: 159,
    rating: 4.6,
    reviews: 862,
    stock: 74,
    badge: 'Sale',
    featured: true,
    bestseller: true,
    gallery: ['1590658268037-6bf12165a8df', '1608043152269-423dbba4e7e1', '1618366712010-f4ae9c647dcb'],
    description:
      'Pocket-sized buds with punchy bass, crystal-clear calls and a charging case that keeps the music going all week. Sweat-resistant and made for movement.',
    specs: [
      { label: 'Driver', value: '11 mm dynamic' },
      { label: 'Battery life', value: '8 h + 24 h case' },
      { label: 'Noise cancelling', value: 'Active ANC' },
      { label: 'Water resistance', value: 'IPX5' },
      { label: 'Charging', value: 'USB-C + wireless' },
    ],
  }),
  product({
    id: 'echo-studio-speaker',
    slug: 'echo-studio-speaker',
    name: 'Echo Studio Speaker',
    category: 'audio',
    price: 189,
    oldPrice: 229,
    rating: 4.7,
    reviews: 540,
    stock: 41,
    badge: null,
    featured: true,
    bestseller: false,
    gallery: ['1608043152269-423dbba4e7e1', '1599669454699-248893623440', '1546435770-a3e426bf472b'],
    description:
      'Room-filling 360° sound in a fabric-wrapped body that looks as good as it sounds. Pair two for true stereo or fill your home with multi-room audio.',
    specs: [
      { label: 'Output', value: '60 W' },
      { label: 'Drivers', value: '2 tweeters + woofer' },
      { label: 'Connectivity', value: 'Wi-Fi, Bluetooth 5.2' },
      { label: 'Voice assistant', value: 'Built-in' },
      { label: 'Dimensions', value: '170 × 170 × 190 mm' },
    ],
  }),
  product({
    id: 'nimbus-noise-buds',
    slug: 'nimbus-noise-buds',
    name: 'Nimbus Noise Buds',
    category: 'audio',
    price: 89,
    oldPrice: 119,
    rating: 4.4,
    reviews: 318,
    stock: 96,
    badge: 'Sale',
    featured: false,
    bestseller: false,
    gallery: ['1583394838336-acd977736f90', '1590658268037-6bf12165a8df', '1505740420928-5e560c06d30e'],
    description:
      'Everyday buds that mute the commute, not your playlist. Lightweight, comfortable and tuned for warm, detailed sound.',
    specs: [
      { label: 'Driver', value: '10 mm dynamic' },
      { label: 'Battery life', value: '7 h + 21 h case' },
      { label: 'Noise cancelling', value: 'Hybrid ANC' },
      { label: 'Water resistance', value: 'IPX4' },
      { label: 'Weight', value: '4.6 g per bud' },
    ],
  }),
  product({
    id: 'vertex-smartwatch-pro',
    slug: 'vertex-smartwatch-pro',
    name: 'Vertex Smartwatch Pro',
    category: 'wearables',
    price: 299,
    oldPrice: 379,
    rating: 4.8,
    reviews: 980,
    stock: 28,
    badge: 'Best Seller',
    featured: true,
    bestseller: true,
    gallery: ['1523275335684-37898b6baf30', '1523170335258-f5ed11844a49', '1546868871-7041f2a55e12'],
    description:
      'A titanium-framed smartwatch with an always-on AMOLED display, advanced sleep tracking and a battery that lasts ten days, not one.',
    specs: [
      { label: 'Display', value: '1.43" AMOLED' },
      { label: 'Battery life', value: 'Up to 10 days' },
      { label: 'Water resistance', value: '5 ATM' },
      { label: 'GPS', value: 'Dual-band' },
      { label: 'Case', value: 'Grade-5 titanium' },
    ],
  }),
  product({
    id: 'halo-fitness-band',
    slug: 'halo-fitness-band',
    name: 'Halo Fitness Band',
    category: 'wearables',
    price: 79,
    oldPrice: 99,
    rating: 4.5,
    reviews: 710,
    stock: 112,
    badge: null,
    featured: false,
    bestseller: false,
    gallery: ['1546868871-7041f2a55e12', '1523206489230-c012c64b2b48', '1523275335684-37898b6baf30'],
    description:
      'A featherweight band that tracks steps, heart rate and sleep without getting in the way. Two weeks of battery in a 24 g package.',
    specs: [
      { label: 'Display', value: '1.1" AMOLED' },
      { label: 'Battery life', value: 'Up to 14 days' },
      { label: 'Sensors', value: 'HR, SpO2, accelerometer' },
      { label: 'Water resistance', value: '5 ATM' },
      { label: 'Weight', value: '24 g' },
    ],
  }),
  product({
    id: 'orbit-smart-ring',
    slug: 'orbit-smart-ring',
    name: 'Orbit Smart Ring',
    category: 'wearables',
    price: 349,
    oldPrice: 399,
    rating: 4.6,
    reviews: 220,
    stock: 17,
    badge: 'New',
    featured: false,
    bestseller: false,
    gallery: ['1523206489230-c012c64b2b48', '1523170335258-f5ed11844a49', '1546868871-7041f2a55e12'],
    description:
      'A titanium smart ring that tracks recovery, sleep and readiness without a screen in sight. Discreet health insights, all day and all night.',
    specs: [
      { label: 'Material', value: 'Titanium' },
      { label: 'Battery life', value: 'Up to 7 days' },
      { label: 'Sensors', value: 'HR, temperature, SpO2' },
      { label: 'Water resistance', value: '10 ATM' },
      { label: 'Weight', value: '4 g' },
    ],
  }),
  product({
    id: 'pulse-active-watch',
    slug: 'pulse-active-watch',
    name: 'Pulse Active Watch',
    category: 'wearables',
    price: 199,
    oldPrice: 249,
    rating: 4.5,
    reviews: 430,
    stock: 54,
    badge: 'New',
    featured: false,
    bestseller: false,
    gallery: ['1523170335258-f5ed11844a49', '1523275335684-37898b6baf30', '1546868871-7041f2a55e12'],
    description:
      'A lightweight training partner with 120 workout modes, dual-band GPS and a bright display you can read in direct sunlight.',
    specs: [
      { label: 'Display', value: '1.39" AMOLED' },
      { label: 'Battery life', value: 'Up to 12 days' },
      { label: 'Workout modes', value: '120+' },
      { label: 'GPS', value: 'Dual-band' },
      { label: 'Water resistance', value: '5 ATM' },
    ],
  }),
  product({
    id: 'nova-rgb-keyboard',
    slug: 'nova-rgb-keyboard',
    name: 'Nova RGB Keyboard',
    category: 'gaming',
    price: 149,
    oldPrice: 179,
    rating: 4.7,
    reviews: 650,
    stock: 38,
    badge: 'Best Seller',
    featured: true,
    bestseller: true,
    gallery: ['1587829741301-dc798b83add3', '1593642632823-8f785ba67e45', '1527814050087-3793815479db'],
    description:
      'Hot-swappable mechanical switches, per-key RGB and an aluminium frame built for marathon sessions. Type, play and create on your terms.',
    specs: [
      { label: 'Layout', value: '75% (82 keys)' },
      { label: 'Switches', value: 'Hot-swappable linear' },
      { label: 'Connectivity', value: 'USB-C, 2.4 GHz, Bluetooth' },
      { label: 'Battery life', value: 'Up to 120 hours' },
      { label: 'Frame', value: 'CNC aluminium' },
    ],
  }),
  product({
    id: 'phantom-gaming-mouse',
    slug: 'phantom-gaming-mouse',
    name: 'Phantom Gaming Mouse',
    category: 'gaming',
    price: 69,
    oldPrice: 89,
    rating: 4.6,
    reviews: 890,
    stock: 87,
    badge: null,
    featured: false,
    bestseller: true,
    gallery: ['1527814050087-3793815479db', '1587829741301-dc798b83add3', '1527443224154-c4a3942d3acf'],
    description:
      'A 58 g ultralight mouse with a 26K optical sensor and zero-latency wireless. Precise, effortless and ready for ranked.',
    specs: [
      { label: 'Weight', value: '58 g' },
      { label: 'Sensor', value: '26,000 DPI optical' },
      { label: 'Polling rate', value: '1000 Hz' },
      { label: 'Battery life', value: 'Up to 90 hours' },
      { label: 'Switches', value: 'Optical, 100M clicks' },
    ],
  }),
  product({
    id: 'vortex-vr-headset',
    slug: 'vortex-vr-headset',
    name: 'Vortex VR Headset',
    category: 'gaming',
    price: 399,
    oldPrice: 499,
    rating: 4.5,
    reviews: 340,
    stock: 21,
    badge: null,
    featured: false,
    bestseller: false,
    gallery: ['1622979135225-d2ba269cf1ac', '1527443224154-c4a3942d3acf', '1587829741301-dc798b83add3'],
    description:
      'Step into worlds with a 4K per-eye display, inside-out tracking and controllers that feel like an extension of your hands.',
    specs: [
      { label: 'Display', value: '4K per eye, 120 Hz' },
      { label: 'Tracking', value: '6DoF inside-out' },
      { label: 'Storage', value: '256 GB' },
      { label: 'Battery life', value: 'Up to 3 hours' },
      { label: 'Weight', value: '515 g' },
    ],
  }),
  product({
    id: 'titan-curved-monitor',
    slug: 'titan-curved-monitor',
    name: 'Titan 34" Curved Monitor',
    category: 'gaming',
    price: 549,
    oldPrice: 649,
    rating: 4.8,
    reviews: 410,
    stock: 15,
    badge: null,
    featured: true,
    bestseller: false,
    gallery: ['1527443224154-c4a3942d3acf', '1593642632823-8f785ba67e45', '1518455027359-f3f8164ba6bd'],
    description:
      'A 165 Hz ultrawide QHD panel with HDR600 and a curve that pulls you into the action. More screen, fewer excuses.',
    specs: [
      { label: 'Size', value: '34" ultrawide' },
      { label: 'Resolution', value: '3440 × 1440' },
      { label: 'Refresh rate', value: '165 Hz' },
      { label: 'Panel', value: 'IPS, HDR600' },
      { label: 'Ports', value: '2× HDMI 2.1, DP 1.4, USB-C' },
    ],
  }),
  product({
    id: 'aperture-mirrorless-camera',
    slug: 'aperture-mirrorless-camera',
    name: 'Aperture Mirrorless Camera',
    category: 'cameras',
    price: 1299,
    oldPrice: 1499,
    rating: 4.9,
    reviews: 260,
    stock: 9,
    badge: 'Best Seller',
    featured: true,
    bestseller: true,
    gallery: ['1516035069371-29a1b244cc32', '1526170375885-4d8ecf77b99f', '1473968512647-3e447244af8f'],
    description:
      'A full-frame mirrorless camera with 33 MP resolution, 8K video and subject-tracking autofocus that never loses the moment.',
    specs: [
      { label: 'Sensor', value: '33 MP full-frame' },
      { label: 'Video', value: '8K 30p / 4K 120p' },
      { label: 'Autofocus', value: 'AI subject tracking' },
      { label: 'Stabilisation', value: '5-axis IBIS' },
      { label: 'Mount', value: 'Aperture E-mount' },
    ],
  }),
  product({
    id: 'drift-4k-action-cam',
    slug: 'drift-4k-action-cam',
    name: 'Drift 4K Action Cam',
    category: 'cameras',
    price: 329,
    oldPrice: 399,
    rating: 4.5,
    reviews: 480,
    stock: 46,
    badge: null,
    featured: false,
    bestseller: false,
    gallery: ['1526170375885-4d8ecf77b99f', '1473968512647-3e447244af8f', '1516035069371-29a1b244cc32'],
    description:
      'Pocket-sized, waterproof and impossibly steady. Drift captures 4K footage with horizon lock wherever the day takes you.',
    specs: [
      { label: 'Video', value: '4K 60p' },
      { label: 'Stabilisation', value: 'HyperSteady + horizon lock' },
      { label: 'Waterproof', value: '10 m without case' },
      { label: 'Battery life', value: 'Up to 2.5 hours' },
      { label: 'Field of view', value: '155°' },
    ],
  }),
  product({
    id: 'skyline-camera-drone',
    slug: 'skyline-camera-drone',
    name: 'Skyline Camera Drone',
    category: 'cameras',
    price: 799,
    oldPrice: 899,
    rating: 4.7,
    reviews: 190,
    stock: 12,
    badge: 'New',
    featured: false,
    bestseller: false,
    gallery: ['1473968512647-3e447244af8f', '1516035069371-29a1b244cc32', '1526170375885-4d8ecf77b99f'],
    description:
      'Foldable, quiet and equipped with a 1-inch sensor, Skyline turns ordinary views into cinematic aerials with 46 minutes of flight time.',
    specs: [
      { label: 'Camera', value: '1" CMOS, 20 MP' },
      { label: 'Video', value: '5.4K 30p' },
      { label: 'Flight time', value: '46 minutes' },
      { label: 'Range', value: '15 km' },
      { label: 'Weight', value: '895 g' },
    ],
  }),
  product({
    id: 'slate-pro-ultrabook',
    slug: 'slate-pro-ultrabook',
    name: 'Slate Pro 14" Ultrabook',
    category: 'computers',
    price: 1199,
    oldPrice: 1399,
    rating: 4.8,
    reviews: 380,
    stock: 23,
    badge: 'Best Seller',
    featured: true,
    bestseller: true,
    gallery: ['1496181133206-80ce9b88a853', '1517336714731-489689fd1ca8', '1593642632823-8f785ba67e45'],
    description:
      'A featherweight 14-inch ultrabook with a 3K OLED display, silent performance and battery that lasts from first coffee to last call.',
    specs: [
      { label: 'Display', value: '14" 3K OLED, 120 Hz' },
      { label: 'Processor', value: '12-core mobile CPU' },
      { label: 'Memory', value: '16 GB LPDDR5' },
      { label: 'Storage', value: '1 TB NVMe SSD' },
      { label: 'Battery life', value: 'Up to 18 hours' },
    ],
  }),
  product({
    id: 'atlas-studio-laptop',
    slug: 'atlas-studio-laptop',
    name: 'Atlas Studio Laptop',
    category: 'computers',
    price: 1599,
    oldPrice: 1799,
    rating: 4.7,
    reviews: 210,
    stock: 14,
    badge: null,
    featured: false,
    bestseller: false,
    gallery: ['1517336714731-489689fd1ca8', '1496181133206-80ce9b88a853', '1593642632823-8f785ba67e45'],
    description:
      'Desktop-class power in a machined aluminium chassis. Built for editors, developers and anyone who refuses to wait for a render.',
    specs: [
      { label: 'Display', value: '16" 3.5K OLED' },
      { label: 'Processor', value: '16-core mobile CPU' },
      { label: 'Graphics', value: 'Discrete 12 GB GPU' },
      { label: 'Memory', value: '32 GB' },
      { label: 'Storage', value: '2 TB NVMe SSD' },
    ],
  }),
  product({
    id: 'vector-mini-desktop',
    slug: 'vector-mini-desktop',
    name: 'Vector Mini Desktop',
    category: 'computers',
    price: 899,
    oldPrice: 999,
    rating: 4.6,
    reviews: 140,
    stock: 31,
    badge: null,
    featured: false,
    bestseller: false,
    gallery: ['1593642632823-8f785ba67e45', '1518455027359-f3f8164ba6bd', '1496181133206-80ce9b88a853'],
    description:
      'A palm-sized desktop that drives two 4K displays, stays whisper quiet and disappears behind your monitor.',
    specs: [
      { label: 'Processor', value: '8-core mobile CPU' },
      { label: 'Memory', value: '16 GB' },
      { label: 'Storage', value: '512 GB NVMe SSD' },
      { label: 'Ports', value: '2× HDMI, 4× USB, 2.5G LAN' },
      { label: 'Volume', value: '0.6 L' },
    ],
  }),
  product({
    id: 'lumen-desk-lamp',
    slug: 'lumen-desk-lamp',
    name: 'Lumen Desk Lamp',
    category: 'home',
    price: 89,
    oldPrice: 109,
    rating: 4.6,
    reviews: 230,
    stock: 63,
    badge: null,
    featured: false,
    bestseller: false,
    gallery: ['1507473885765-e6ed057f782c', '1616486338812-3dadae4b4ace', '1611186871348-b1ce696e52c9'],
    description:
      'Warm-to-cool dimmable light in a minimalist silhouette. Lumen adjusts to your task and remembers your favourite setting.',
    specs: [
      { label: 'Brightness', value: '600 lumens' },
      { label: 'Colour temperature', value: '2700K – 6500K' },
      { label: 'Control', value: 'Touch dimmer + memory' },
      { label: 'Power', value: 'USB-C, 12 W' },
      { label: 'Material', value: 'Aluminium + silicone' },
    ],
  }),
  product({
    id: 'form-lounge-chair',
    slug: 'form-lounge-chair',
    name: 'Form Lounge Chair',
    category: 'home',
    price: 459,
    oldPrice: 549,
    rating: 4.7,
    reviews: 150,
    stock: 8,
    badge: null,
    featured: true,
    bestseller: false,
    gallery: ['1567538096630-e0c55bd6374c', '1586023492125-27b2c045efd7', '1616486338812-3dadae4b4ace'],
    description:
      'A sculptural lounge chair with a deep seat, supportive curves and upholstery that feels as considered as it looks.',
    specs: [
      { label: 'Frame', value: 'Solid ash' },
      { label: 'Upholstery', value: 'Wool-blend bouclé' },
      { label: 'Dimensions', value: '78 × 82 × 74 cm' },
      { label: 'Seat height', value: '42 cm' },
      { label: 'Assembly', value: 'Minimal, tools included' },
    ],
  }),
  product({
    id: 'atelier-scented-candle',
    slug: 'atelier-scented-candle',
    name: 'Atelier Scented Candle',
    category: 'home',
    price: 39,
    oldPrice: 49,
    rating: 4.8,
    reviews: 620,
    stock: 140,
    badge: 'Best Seller',
    featured: false,
    bestseller: true,
    gallery: ['1603006905003-be475563bc59', '1519710164239-da123dc03ef4', '1541643600914-78b084683601'],
    description:
      'Cedar, amber and a hint of smoke. Hand-poured soy wax in a reusable ceramic vessel with a 55-hour burn time.',
    specs: [
      { label: 'Scent', value: 'Cedar, amber, vetiver' },
      { label: 'Wax', value: '100% soy' },
      { label: 'Burn time', value: '55 hours' },
      { label: 'Weight', value: '320 g' },
      { label: 'Vessel', value: 'Reusable ceramic' },
    ],
  }),
  product({
    id: 'terra-ceramic-vase',
    slug: 'terra-ceramic-vase',
    name: 'Terra Ceramic Vase',
    category: 'home',
    price: 59,
    oldPrice: 69,
    rating: 4.4,
    reviews: 120,
    stock: 44,
    badge: null,
    featured: false,
    bestseller: false,
    gallery: ['1611186871348-b1ce696e52c9', '1616486338812-3dadae4b4ace', '1586023492125-27b2c045efd7'],
    description:
      'Hand-thrown stoneware with a soft matte glaze. A quiet centrepiece for stems, shelves or nothing at all.',
    specs: [
      { label: 'Material', value: 'Stoneware' },
      { label: 'Finish', value: 'Matte glaze' },
      { label: 'Height', value: '28 cm' },
      { label: 'Opening', value: '8 cm' },
      { label: 'Care', value: 'Hand wash' },
    ],
  }),
  product({
    id: 'nomad-leather-backpack',
    slug: 'nomad-leather-backpack',
    name: 'Nomad Leather Backpack',
    category: 'accessories',
    price: 139,
    oldPrice: 169,
    rating: 4.7,
    reviews: 540,
    stock: 26,
    badge: 'Best Seller',
    featured: true,
    bestseller: true,
    gallery: ['1553062407-98eeb64c6a62', '1584917865442-de89df76afd3', '1590874103328-eac38a683ce7'],
    description:
      'Full-grain leather, a padded 16-inch laptop sleeve and a silhouette that gets better with every trip. Built to be carried for years.',
    specs: [
      { label: 'Material', value: 'Full-grain leather' },
      { label: 'Capacity', value: '22 L' },
      { label: 'Laptop sleeve', value: 'Fits up to 16"' },
      { label: 'Water resistance', value: 'Weather-resistant lining' },
      { label: 'Warranty', value: '5 years' },
    ],
  }),
  product({
    id: 'solstice-sunglasses',
    slug: 'solstice-sunglasses',
    name: 'Solstice Sunglasses',
    category: 'accessories',
    price: 119,
    oldPrice: 149,
    rating: 4.5,
    reviews: 380,
    stock: 58,
    badge: null,
    featured: false,
    bestseller: false,
    gallery: ['1511499767150-a48a237f0083', '1572635196237-14b3f281503f', '1584917865442-de89df76afd3'],
    description:
      'Polarised lenses in a lightweight acetate frame. Classic lines, modern proportions and 100% UV protection.',
    specs: [
      { label: 'Lenses', value: 'Polarised, UV400' },
      { label: 'Frame', value: 'Italian acetate' },
      { label: 'Width', value: '145 mm' },
      { label: 'Hinges', value: 'Five-barrel' },
      { label: 'Includes', value: 'Case + microfibre cloth' },
    ],
  }),
  product({
    id: 'metro-runner-sneakers',
    slug: 'metro-runner-sneakers',
    name: 'Metro Runner Sneakers',
    category: 'accessories',
    price: 129,
    oldPrice: 159,
    rating: 4.6,
    reviews: 720,
    stock: 67,
    badge: null,
    featured: false,
    bestseller: true,
    gallery: ['1542291026-7eec264c27ff', '1549298916-b41d501d3772', '1600185365483-26d7a4cc7519'],
    description:
      'A responsive foam midsole, breathable knit upper and a shape that works from the track to the street.',
    specs: [
      { label: 'Upper', value: 'Recycled engineered knit' },
      { label: 'Midsole', value: 'Responsive foam' },
      { label: 'Drop', value: '8 mm' },
      { label: 'Weight', value: '245 g (size 42)' },
      { label: 'Outsole', value: 'Rubber' },
    ],
  }),
  product({
    id: 'everyday-canvas-sneakers',
    slug: 'everyday-canvas-sneakers',
    name: 'Everyday Canvas Sneakers',
    category: 'accessories',
    price: 89,
    oldPrice: 109,
    rating: 4.4,
    reviews: 610,
    stock: 83,
    badge: null,
    featured: false,
    bestseller: false,
    gallery: ['1549298916-b41d501d3772', '1542291026-7eec264c27ff', '1600185365483-26d7a4cc7519'],
    description:
      'The pair you reach for without thinking. Organic canvas, a cushioned insole and a clean, timeless profile.',
    specs: [
      { label: 'Upper', value: 'Organic cotton canvas' },
      { label: 'Insole', value: 'Cushioned, removable' },
      { label: 'Sole', value: 'Vulcanised rubber' },
      { label: 'Lining', value: 'Recycled cotton' },
      { label: 'Care', value: 'Machine washable' },
    ],
  }),
  product({
    id: 'aero-phone-case',
    slug: 'aero-phone-case',
    name: 'Aero MagSafe Phone Case',
    category: 'accessories',
    price: 39,
    oldPrice: 49,
    rating: 4.3,
    reviews: 450,
    stock: 150,
    badge: 'Sale',
    featured: false,
    bestseller: false,
    gallery: ['1511707171634-5f897ff02aa9', '1508685096489-7aacd43bd3b1', '1615663245857-ac93bb7c39e7'],
    description:
      'A slim, grippy case with a strong MagSafe ring and raised edges that protect the screen without adding bulk.',
    specs: [
      { label: 'Material', value: 'Recycled TPU' },
      { label: 'Compatibility', value: 'MagSafe' },
      { label: 'Drop protection', value: '3 m' },
      { label: 'Thickness', value: '1.8 mm' },
      { label: 'Finish', value: 'Soft-touch matte' },
    ],
  }),
];

export const getLocalProduct = (slug) =>
  products.find((item) => item.slug === slug || item.id === slug) ?? null;

export const getCategory = (slug) => categories.find((item) => item.slug === slug) ?? null;

export const filterLocalProducts = ({
  search = '',
  category = '',
  minPrice = 0,
  maxPrice = 0,
  sort = 'featured',
  featured,
  bestseller,
  sale = false,
  limit = 0,
} = {}) => {
  const term = String(search).trim().toLowerCase();
  let result = products.filter((item) => {
    if (category && item.category !== category) return false;
    if (featured !== undefined && item.featured !== featured) return false;
    if (bestseller !== undefined && item.bestseller !== bestseller) return false;
    if (sale && !(item.oldPrice > item.price)) return false;
    if (minPrice && item.price < Number(minPrice)) return false;
    if (maxPrice && item.price > Number(maxPrice)) return false;
    if (!term) return true;
    return (
      item.name.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.categoryName.toLowerCase().includes(term)
    );
  });

  switch (sort) {
    case 'price-asc':
      result = result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result = result.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      result = result.sort((a, b) => b.rating - a.rating);
      break;
    case 'popularity':
      result = result.sort((a, b) => b.reviews - a.reviews);
      break;
    default:
      result = result.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || b.reviews - a.reviews,
      );
  }

  return limit > 0 ? result.slice(0, limit) : result;
};

export const getRelatedProducts = (product, limit = 4) =>
  products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);

export const priceBounds = {
  min: Math.min(...products.map((item) => item.price)),
  max: Math.max(...products.map((item) => item.price)),
};
