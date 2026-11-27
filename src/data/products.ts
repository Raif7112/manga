export interface Product {
  id: number;
  name: string;
  origin: string;
  category: string;
  price: number;
  weight: string;
  roastLevel: 'Light' | 'Medium' | 'Dark';
  flavorNotes: string[];
  description: string;
  altitude: string;
  process: string;
  image: string;
  rating: number;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Ethiopian Yirgacheffe',
    origin: 'Ethiopia',
    category: 'Single Origin',
    price: 24.99,
    weight: '250g',
    roastLevel: 'Light',
    flavorNotes: ['Blueberry', 'Jasmine', 'Bergamot', 'Honey'],
    description: 'A stunning light roast from the birthplace of coffee. This naturally processed Yirgacheffe delivers an explosion of fruity complexity with a delicate floral finish. Each sip reveals layers of ripe blueberry and jasmine, balanced by a silky honey sweetness.',
    altitude: '1,800 - 2,200m',
    process: 'Natural',
    image: '🫐',
    rating: 4.9,
    inStock: true,
  },
  {
    id: 2,
    name: 'Colombian Supremo',
    origin: 'Colombia',
    category: 'Single Origin',
    price: 19.99,
    weight: '250g',
    roastLevel: 'Medium',
    flavorNotes: ['Caramel', 'Walnut', 'Red Apple', 'Cocoa'],
    description: 'A perfectly balanced medium roast from the lush highlands of Huila, Colombia. This Supremo grade bean offers a smooth, rounded body with rich caramel sweetness and a satisfying nutty finish. An everyday luxury that never disappoints.',
    altitude: '1,500 - 1,800m',
    process: 'Washed',
    image: '🍫',
    rating: 4.7,
    inStock: true,
  },
  {
    id: 3,
    name: 'Sumatra Mandheling',
    origin: 'Indonesia',
    category: 'Single Origin',
    price: 22.99,
    weight: '250g',
    roastLevel: 'Dark',
    flavorNotes: ['Dark Chocolate', 'Cedar', 'Tobacco', 'Earth'],
    description: 'A bold, full-bodied dark roast from the volcanic soils of northern Sumatra. The wet-hulled processing method creates a uniquely earthy profile with deep dark chocolate undertones. Perfect for those who appreciate a robust, lingering finish.',
    altitude: '1,100 - 1,600m',
    process: 'Wet-Hulled',
    image: '🌿',
    rating: 4.6,
    inStock: true,
  },
  {
    id: 4,
    name: 'Guatemala Antigua',
    origin: 'Guatemala',
    category: 'Single Origin',
    price: 21.99,
    weight: '250g',
    roastLevel: 'Medium',
    flavorNotes: ['Dark Chocolate', 'Cinnamon', 'Orange Peel', 'Brown Sugar'],
    description: 'Grown in the shadow of three volcanoes, this exceptional medium roast from the Antigua valley delivers a sophisticated cup. Rich chocolate and warm cinnamon spice intertwine with bright citrus notes, creating a complex yet approachable profile.',
    altitude: '1,500 - 1,700m',
    process: 'Washed',
    image: '🍊',
    rating: 4.8,
    inStock: true,
  },
  {
    id: 5,
    name: 'Kenya AA Nyeri',
    origin: 'Kenya',
    category: 'Single Origin',
    price: 27.99,
    weight: '250g',
    roastLevel: 'Light',
    flavorNotes: ['Blackcurrant', 'Grapefruit', 'Tomato', 'Raw Sugar'],
    description: 'An extraordinary light roast from Kenya\'s famed Nyeri region. The AA grade signifies the largest, most flavorful beans. Expect a vibrant, wine-like acidity with intense blackcurrant and grapefruit notes, finishing with a sweet raw sugar complexity.',
    altitude: '1,700 - 2,000m',
    process: 'Washed',
    image: '🍇',
    rating: 4.9,
    inStock: true,
  },
  {
    id: 6,
    name: 'Brazilian Santos',
    origin: 'Brazil',
    category: 'Blend',
    price: 17.99,
    weight: '250g',
    roastLevel: 'Medium',
    flavorNotes: ['Milk Chocolate', 'Peanut', 'Vanilla', 'Toffee'],
    description: 'A smooth, crowd-pleasing medium roast from the rolling hills of Minas Gerais. This Santos variety offers a clean, sweet cup with comforting notes of milk chocolate and roasted peanut. Low acidity and a creamy body make it ideal for espresso or milk-based drinks.',
    altitude: '900 - 1,200m',
    process: 'Natural',
    image: '🥜',
    rating: 4.5,
    inStock: true,
  },
];

export const categories = ['All', 'Light Roast', 'Medium Roast', 'Dark Roast', 'Single Origin', 'Blend'];
