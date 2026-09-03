export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  icon_url?: string;
  created_at: string;
}

export interface BrandItem {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  created_at: string;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  category?: any;
  brand_id: string;
  brand?: any;
  price: number;
  base_price: number;
  compare_at_price?: number;
  stock: number;
  stock_quantity: number;
  availability_status: string;
  description: string;
  short_description?: string;
  image_url: string;
  image_urls: string[];
  images: Array<{ id: string; image_url: string; display_order: number }>;
  specifications?: Record<string, string>;
  product_variants?: Array<{
    id: string;
    product_id: string;
    sku: string;
    attributes: Record<string, string>;
    price_modifier: number;
    inventory_count: number;
  }>;
  created_at: string;
  low_stock_threshold?: number;
  requires_quote?: boolean;
  is_service?: boolean;
  is_rentable?: boolean;
  transaction_type?: 'buy' | 'rent';
}

export const INITIAL_STORE_SETTINGS = {
  id: 1,
  show_prices: true,
  enable_checkout: true,
  support_email: 'info@abletechnologies.lk',
  whatsapp_number: '+94771234567',
  created_at: '2025-01-01T00:00:00.000Z'
};

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-1',
    name: 'Pneumatics & Cylinders',
    slug: 'pneumatics-cylinders',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    icon_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    created_at: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'cat-2',
    name: 'Industrial Robotics',
    slug: 'industrial-robotics',
    image_url: '/src/assets/Tool.png',
    icon_url: '/src/assets/Tool.png',
    created_at: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'cat-3',
    name: 'Hydraulics & Lifting',
    slug: 'hydraulics-lifting',
    image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
    icon_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
    created_at: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'cat-4',
    name: 'Machinery & CNC',
    slug: 'machinery-cnc',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
    icon_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
    created_at: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'cat-5',
    name: 'Precision Gauges & Tools',
    slug: 'precision-gauges-tools',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80',
    icon_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80',
    created_at: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'cat-6',
    name: 'Spare Parts & Fittings',
    slug: 'spare-parts-fittings',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    icon_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    created_at: '2025-01-01T00:00:00.000Z'
  }
];

export const INITIAL_BRANDS: BrandItem[] = [
  {
    id: 'brand-1',
    name: 'Able Technologies',
    slug: 'able-technologies',
    logo_url: '/src/assets/ableLogo.png',
    created_at: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'brand-2',
    name: 'SMC Pneumatics',
    slug: 'smc-pneumatics',
    logo_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80',
    created_at: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'brand-3',
    name: 'VEVOR',
    slug: 'vevor',
    logo_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=200&q=80',
    created_at: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'brand-4',
    name: 'Festo Automation',
    slug: 'festo-automation',
    logo_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=200&q=80',
    created_at: '2025-01-01T00:00:00.000Z'
  }
];

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-cylinder-15552',
    name: 'Air Cylinder ISO 15552',
    slug: 'air-cylinder-iso-15552',
    sku: 'SMC-CYL-15552',
    category_id: 'cat-1',
    category_name: 'Pneumatics & Cylinders',
    category_slug: 'pneumatics-cylinders',
    category: 'Pneumatics & Cylinders',
    brand_id: 'brand-2',
    brand: 'SMC Pneumatics',
    price: 12500,
    base_price: 12500,
    compare_at_price: 14200,
    stock: 48,
    stock_quantity: 48,
    availability_status: 'in_stock',
    description: 'Double-acting profile cylinder ISO 15552 with adjustable end-position cushioning for heavy industrial automation systems. Delivers maximum cycle durability and seamless integration.',
    short_description: 'Double-acting profile cylinder ISO 15552 with adjustable end-position cushioning.',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    image_urls: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    images: [
      { id: 'img-1', image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', display_order: 1 }
    ],
    specifications: {
      'Bore Size': '63 mm',
      'Stroke Length': '250 mm',
      'Operating Pressure': '1 - 10 bar',
      'Standard': 'ISO 15552',
      'Fluid': 'Filtered compressed air'
    },
    product_variants: [
      { id: 'var-1', product_id: 'prod-cylinder-15552', sku: 'SMC-CYL-15552-63', attributes: { 'Bore': '63mm' }, price_modifier: 0, inventory_count: 24 },
      { id: 'var-2', product_id: 'prod-cylinder-15552', sku: 'SMC-CYL-15552-80', attributes: { 'Bore': '80mm' }, price_modifier: 2500, inventory_count: 24 }
    ],
    created_at: '2025-01-05T00:00:00.000Z',
    low_stock_threshold: 5
  },
  {
    id: 'prod-robotic-arm-6axis',
    name: 'Industrial Robotic Arm 6 Axis',
    slug: 'industrial-robotic-arm-6-axis',
    sku: 'ARM-6AX-2000',
    category_id: 'cat-2',
    category_name: 'Industrial Robotics',
    category_slug: 'industrial-robotics',
    category: 'Industrial Robotics',
    brand_id: 'brand-1',
    brand: 'Able Robotics',
    price: 1850000,
    base_price: 1850000,
    compare_at_price: 2050000,
    stock: 6,
    stock_quantity: 6,
    availability_status: 'in_stock',
    description: 'High-precision 6-axis articulated industrial robotic arm engineered for precision assembly, welding, packaging, and high-speed pick & place operations with sub-millimeter accuracy.',
    short_description: 'High-precision 6-axis articulated industrial robotic arm engineered for automated assembly.',
    image_url: '/src/assets/Tool.png',
    image_urls: ['/src/assets/Tool.png'],
    images: [
      { id: 'img-2', image_url: '/src/assets/Tool.png', display_order: 1 }
    ],
    specifications: {
      'Payload': '20 kg',
      'Reach': '1850 mm',
      'Repeatability': '±0.05 mm',
      'Degrees of Freedom': '6 Axis',
      'Protection Rating': 'IP67'
    },
    product_variants: [
      { id: 'var-3', product_id: 'prod-robotic-arm-6axis', sku: 'ARM-6AX-20KG', attributes: { 'Payload': '20kg' }, price_modifier: 0, inventory_count: 4 },
      { id: 'var-4', product_id: 'prod-robotic-arm-6axis', sku: 'ARM-6AX-35KG', attributes: { 'Payload': '35kg' }, price_modifier: 350000, inventory_count: 2 }
    ],
    created_at: '2025-01-06T00:00:00.000Z',
    low_stock_threshold: 2
  },
  {
    id: 'prod-vevor-jack-50t',
    name: 'VEVOR 50-Ton Hydraulic Bottle Jack',
    slug: 'vevor-50-ton-hydraulic-bottle-jack',
    sku: 'VEV-HYD-50T',
    category_id: 'cat-3',
    category_name: 'Hydraulics & Lifting',
    category_slug: 'hydraulics-lifting',
    category: 'Hydraulics & Lifting',
    brand_id: 'brand-3',
    brand: 'VEVOR',
    price: 20000,
    base_price: 20000,
    compare_at_price: 24500,
    stock: 19,
    stock_quantity: 19,
    availability_status: 'in_stock',
    description: 'Heavy-duty commercial pneumatic/hydraulic bottle jack designed for industrial machinery, heavy commercial vehicles, and rig operations with overload safety valve.',
    short_description: 'Heavy-duty 50-ton pneumatic/hydraulic bottle jack for industrial lifting.',
    image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    image_urls: ['https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80'],
    images: [
      { id: 'img-3', image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80', display_order: 1 }
    ],
    specifications: {
      'Capacity': '50 Tons',
      'Min Height': '280 mm',
      'Max Height': '460 mm',
      'Operation': 'Air / Manual Hydraulic'
    },
    product_variants: [],
    created_at: '2025-01-07T00:00:00.000Z',
    low_stock_threshold: 4
  },
  {
    id: 'prod-pad-printer-pneu',
    name: 'Pneumatic Pad Printing Machine',
    slug: 'pneumatic-pad-printing-machine',
    sku: 'PRT-PAD-480',
    category_id: 'cat-4',
    category_name: 'Machinery & CNC',
    category_slug: 'machinery-cnc',
    category: 'Machinery & CNC',
    brand_id: 'brand-1',
    brand: 'Able Technologies',
    price: 485000,
    base_price: 485000,
    compare_at_price: 570000,
    stock: 12,
    stock_quantity: 12,
    availability_status: 'in_stock',
    description: 'Microprocessor-controlled single-color sealed ink cup pad printing machine for high-precision components and industrial promotional product markings.',
    short_description: 'Single-color sealed ink cup pad printing machine for precision markings.',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    image_urls: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'],
    images: [
      { id: 'img-4', image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', display_order: 1 }
    ],
    specifications: {
      'Ink Cup Size': '90 mm',
      'Max Printing Speed': '2000 pcs/hr',
      'Air Pressure': '5 - 7 bar',
      'Control': 'Digital Microprocessor'
    },
    product_variants: [],
    created_at: '2025-01-08T00:00:00.000Z',
    low_stock_threshold: 3
  },
  {
    id: 'prod-fitting-set-brass',
    name: 'Pneumatic Fittings Set ISO Quick-Lock',
    slug: 'pneumatic-fittings-set',
    sku: 'FIT-PNEU-SET',
    category_id: 'cat-6',
    category_name: 'Spare Parts & Fittings',
    category_slug: 'spare-parts-fittings',
    category: 'Spare Parts & Fittings',
    brand_id: 'brand-2',
    brand: 'SMC Pneumatics',
    price: 1250,
    base_price: 1250,
    compare_at_price: 1360,
    stock: 150,
    stock_quantity: 150,
    availability_status: 'in_stock',
    description: 'Precision nickel-plated brass push-in pneumatic fittings designed for airtight high-pressure airline systems and zero leakage under dynamic vibrations.',
    short_description: 'Precision nickel-plated brass push-in pneumatic fittings set.',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
    image_urls: ['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80'],
    images: [
      { id: 'img-5', image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80', display_order: 1 }
    ],
    specifications: {
      'Material': 'Nickel-Plated Brass',
      'Port Size': '1/4" NPT / 8mm Tube',
      'Max Pressure': '16 bar',
      'Temperature Range': '-20°C to 80°C'
    },
    product_variants: [],
    created_at: '2025-01-09T00:00:00.000Z',
    low_stock_threshold: 20
  },
  {
    id: 'prod-dial-indicator-gauge',
    name: 'Digital Precision Dial Indicator Gauge',
    slug: 'digital-precision-dial-indicator-gauge',
    sku: 'GAU-DIG-001',
    category_id: 'cat-5',
    category_name: 'Precision Gauges & Tools',
    category_slug: 'precision-gauges-tools',
    category: 'Precision Gauges & Tools',
    brand_id: 'brand-1',
    brand: 'Able Technologies',
    price: 18500,
    base_price: 18500,
    compare_at_price: 22000,
    stock: 35,
    stock_quantity: 35,
    availability_status: 'in_stock',
    description: 'Electronic digital dial test indicator with 0-12.7mm measurement range and 0.001mm resolution for machinists, jig makers, and quality control inspection.',
    short_description: 'High-accuracy digital dial test indicator 0.001mm resolution.',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    image_urls: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'],
    images: [
      { id: 'img-6', image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', display_order: 1 }
    ],
    specifications: {
      'Measuring Range': '0 - 12.7 mm / 0.5"',
      'Resolution': '0.001 mm / 0.00005"',
      'Display': 'LCD with Zero Setting'
    },
    product_variants: [],
    created_at: '2025-01-10T00:00:00.000Z',
    low_stock_threshold: 5
  }
];

export const INITIAL_USERS = [
  {
    id: 'usr-admin-1',
    email: 'admin@abletechnologies.lk',
    role: 'ADMIN',
    full_name: 'System Administrator',
    phone: '+94 77 123 4567',
    created_at: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-cust-1',
    email: 'customer@abletechnologies.lk',
    role: 'CUSTOMER',
    full_name: 'John Perera',
    phone: '+94 71 987 6543',
    created_at: '2025-01-01T00:00:00.000Z'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ord-1001',
    user_id: 'usr-cust-1',
    shipping_address: {
      fullName: 'John Perera',
      address: 'No 45 Galle Road',
      city: 'Colombo',
      postalCode: '00300',
      phone: '+94 71 987 6543'
    },
    shipping_method: 'Standard Islandwide Delivery',
    payment_method: 'Cash On Delivery',
    subtotal: 12500,
    shipping_cost: 500,
    vat: 0,
    total_amount: 13000,
    status: 'completed',
    created_at: '2025-01-15T10:30:00.000Z',
    users: {
      full_name: 'John Perera',
      email: 'customer@abletechnologies.lk',
      phone: '+94 71 987 6543'
    },
    order_items: [
      {
        id: 'oi-1',
        order_id: 'ord-1001',
        product_id: 'prod-cylinder-15552',
        product_name: 'Air Cylinder ISO 15552',
        unit_price: 12500,
        quantity: 1
      }
    ]
  },
  {
    id: 'ord-1002',
    user_id: 'usr-cust-1',
    shipping_address: {
      fullName: 'Sunil Weerasinghe',
      address: '22 Industrial Zone',
      city: 'Kandy',
      postalCode: '20000',
      phone: '+94 77 345 6789'
    },
    shipping_method: 'Express Cargo',
    payment_method: 'Bank Transfer',
    subtotal: 20000,
    shipping_cost: 1200,
    vat: 0,
    total_amount: 21200,
    status: 'pending',
    created_at: '2025-01-18T14:15:00.000Z',
    users: {
      full_name: 'Sunil Weerasinghe',
      email: 'sunil@factory.lk',
      phone: '+94 77 345 6789'
    },
    order_items: [
      {
        id: 'oi-2',
        order_id: 'ord-1002',
        product_id: 'prod-vevor-jack-50t',
        product_name: 'VEVOR 50-Ton Hydraulic Bottle Jack',
        unit_price: 20000,
        quantity: 1
      }
    ]
  }
];

export const INITIAL_STOCK_MOVEMENTS = [
  {
    id: 'mov-1',
    product_id: 'prod-cylinder-15552',
    type: 'RESTOCK',
    quantity: 20,
    reason: 'Supplier Batch Delivery',
    created_at: '2025-01-10T08:00:00.000Z',
    products: { name: 'Air Cylinder ISO 15552', sku: 'SMC-CYL-15552' }
  },
  {
    id: 'mov-2',
    product_id: 'prod-vevor-jack-50t',
    type: 'DISPATCH',
    quantity: -1,
    reason: 'Order #ord-1002 Fulfillment',
    created_at: '2025-01-18T15:00:00.000Z',
    products: { name: 'VEVOR 50-Ton Hydraulic Bottle Jack', sku: 'VEV-HYD-50T' }
  }
];

export const INITIAL_CONTACT_INQUIRIES = [
  {
    id: 'inq-1',
    name: 'Kasun Bandara',
    email: 'kasun@machineworks.lk',
    phone: '+94 77 888 9999',
    subject: 'Bulk Inquiry: ISO Cylinders',
    message: 'We require 50 units of ISO 15552 cylinders for a plant expansion. Please provide a formal proforma quote.',
    status: 'pending',
    created_at: '2025-01-16T09:00:00.000Z'
  }
];

export const INITIAL_SERVICE_INQUIRIES = [
  {
    id: 'sinq-1',
    name: 'Precision Engineering Ltd',
    email: 'maintenance@precision.lk',
    phone: '+94 11 234 5678',
    product_id: 'prod-robotic-arm-6axis',
    service_type: 'Preventive Maintenance',
    description: 'Routine 6-month calibration and joint lubrication required.',
    status: 'scheduled',
    created_at: '2025-01-17T11:20:00.000Z',
    products: { name: 'Industrial Robotic Arm 6 Axis' }
  }
];
