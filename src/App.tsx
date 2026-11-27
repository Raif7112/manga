import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingBag, X, Plus, Minus, Trash2, ArrowLeft,
  Coffee, Star, MapPin, Mountain, Droplets, ChevronRight,
  Check, Filter
} from 'lucide-react';
import { products, categories, Product } from './data/products';
import { CartItem, ViewMode } from './types';

export default function App() {
  const [view, setView] = useState<ViewMode>('shop');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.flavorNotes.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        activeCategory === 'All' ||
        p.category === activeCategory ||
        `${p.roastLevel} Roast` === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const updateQuantity = useCallback((productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const getCartQuantity = useCallback(
    (productId: number) => {
      const item = cart.find((i) => i.product.id === productId);
      return item ? item.quantity : 0;
    },
    [cart]
  );

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-warm-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <button
              onClick={() => { setView('shop'); setSelectedProduct(null); }}
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-warm-700 to-warm-900 flex items-center justify-center">
                <Coffee className="w-5 h-5 text-cream" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-warm-900 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                  Ember & Bloom
                </h1>
                <p className="text-[10px] text-warm-500 uppercase tracking-widest -mt-0.5">
                  Specialty Coffee
                </p>
              </div>
              <span className="sm:hidden text-lg font-bold text-warm-900">E&B</span>
            </button>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                <input
                  type="text"
                  placeholder="Search beans, origins, flavors..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setView('shop'); setSelectedProduct(null); }}
                  className="w-full pl-10 pr-4 py-2.5 bg-warm-50 border border-warm-200 rounded-full text-sm text-warm-900 placeholder:text-warm-400 focus:outline-none focus:border-warm-400 focus:ring-2 focus:ring-warm-200 transition-all"
                />
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-warm-900 text-cream hover:bg-warm-950 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Cart</span>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-warm-950 text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
              <input
                type="text"
                placeholder="Search beans, origins, flavors..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setView('shop'); setSelectedProduct(null); }}
                className="w-full pl-10 pr-4 py-2.5 bg-warm-50 border border-warm-200 rounded-full text-sm text-warm-900 placeholder:text-warm-400 focus:outline-none focus:border-warm-400 focus:ring-2 focus:ring-warm-200 transition-all"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <AnimatePresence mode="wait">
          {view === 'shop' && !selectedProduct && (
            <motion.div
              key="shop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Hero */}
              <section className="mb-10 sm:mb-14">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-warm-800 via-warm-900 to-warm-950 p-8 sm:p-12 lg:p-16">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-8 text-6xl sm:text-8xl">☕</div>
                    <div className="absolute bottom-4 left-8 text-4xl sm:text-6xl">🌱</div>
                  </div>
                  <div className="relative z-10 max-w-2xl">
                    <p className="text-gold text-sm uppercase tracking-widest mb-3 font-medium">
                      Freshly Roasted • Small Batch
                    </p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-cream leading-tight mb-4 text-balance">
                      Exceptional Coffee, Delivered to Your Door
                    </h2>
                    <p className="text-warm-300 text-base sm:text-lg leading-relaxed max-w-lg">
                      Hand-selected beans from the world's finest growing regions, roasted in small batches to unlock their full potential.
                    </p>
                  </div>
                </div>
              </section>

              {/* Category Filters */}
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4 text-warm-500" />
                  <span className="text-sm font-medium text-warm-600 uppercase tracking-wider">Filter by</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        activeCategory === cat
                          ? 'bg-warm-800 text-cream shadow-md'
                          : 'bg-white text-warm-700 border border-warm-200 hover:border-warm-400 hover:bg-warm-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </section>

              {/* Product Grid */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-warm-900">
                    {activeCategory === 'All' ? 'All Coffees' : activeCategory}
                  </h3>
                  <span className="text-sm text-warm-500">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'bean' : 'beans'}
                  </span>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-16">
                    <Coffee className="w-12 h-12 text-warm-300 mx-auto mb-4" />
                    <p className="text-warm-500 text-lg">No coffees found matching your search.</p>
                    <button
                      onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                      className="mt-4 text-warm-700 underline font-medium"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product, index) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        index={index}
                        onViewDetails={() => setSelectedProduct(product)}
                        onAddToCart={() => addToCart(product)}
                        cartQuantity={getCartQuantity(product.id)}
                        onUpdateQuantity={(delta) => updateQuantity(product.id, delta)}
                      />
                    ))}
                  </div>
                )}
              </section>
            </motion.div>
          )}

          {selectedProduct && view === 'shop' && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ProductDetail
                product={selectedProduct}
                onBack={() => setSelectedProduct(null)}
                onAddToCart={(qty) => { addToCart(selectedProduct, qty); }}
                cartQuantity={getCartQuantity(selectedProduct.id)}
                onUpdateQuantity={(delta) => updateQuantity(selectedProduct.id, delta)}
              />
            </motion.div>
          )}

          {view === 'checkout' && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Checkout
                cart={cart}
                total={cartTotal}
                onBack={() => setView('shop')}
                onComplete={() => {
                  setCart([]);
                  setView('confirmation');
                }}
              />
            </motion.div>
          )}

          {view === 'confirmation' && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <Confirmation onBackToShop={() => setView('shop')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overlay"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="slide-panel"
            >
              <CartPanel
                cart={cart}
                total={cartTotal}
                onClose={() => setCartOpen(false)}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
                onCheckout={() => { setCartOpen(false); setView('checkout'); }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-warm-200 mt-16 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Coffee className="w-5 h-5 text-warm-600" />
            <span className="font-bold text-warm-800">Ember & Bloom</span>
          </div>
          <p className="text-sm text-warm-500">
            Crafted with care. Roasted with passion. Delivered with love.
          </p>
          <p className="text-xs text-warm-400 mt-2">
            © 2026 Ember & Bloom Coffee Co. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({
  product,
  index,
  onViewDetails,
  onAddToCart,
  cartQuantity,
  onUpdateQuantity,
}: {
  product: Product;
  index: number;
  onViewDetails: () => void;
  onAddToCart: () => void;
  cartQuantity: number;
  onUpdateQuantity: (delta: number) => void;
}) {
  const roastDots = product.roastLevel === 'Light' ? 1 : product.roastLevel === 'Medium' ? 2 : 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="card group"
    >
      {/* Image Area */}
      <div
        className="relative h-48 sm:h-56 bg-gradient-to-br from-warm-100 to-warm-200 flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={onViewDetails}
      >
        <span className="text-6xl sm:text-7xl group-hover:scale-110 transition-transform duration-500">
          {product.image}
        </span>
        <div className="absolute top-3 left-3">
          <span className="badge bg-white/90 text-warm-700 backdrop-blur-sm">
            {product.roastLevel} Roast
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="badge bg-warm-900/80 text-cream backdrop-blur-sm">
            <Star className="w-3 h-3 mr-1 fill-gold text-gold" />
            {product.rating}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-bold text-warm-900 text-lg leading-tight">{product.name}</h3>
            <p className="text-sm text-warm-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> {product.origin}
            </p>
          </div>
          <span className="text-xl font-bold text-warm-800 whitespace-nowrap">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Flavor Notes */}
        <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
          {product.flavorNotes.slice(0, 3).map((note) => (
            <span key={note} className="text-xs px-2 py-0.5 rounded-full bg-warm-100 text-warm-600">
              {note}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onViewDetails}
            className="flex-1 btn-secondary text-sm py-2 px-3"
          >
            Details
          </button>
          {cartQuantity === 0 ? (
            <button onClick={onAddToCart} className="flex-1 btn-primary text-sm py-2 px-3">
              Add to Cart
            </button>
          ) : (
            <div className="flex-1 flex items-center justify-between bg-warm-100 rounded-lg px-2 py-1">
              <button
                onClick={() => onUpdateQuantity(-1)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-warm-700 hover:bg-warm-200 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-warm-800 text-sm">{cartQuantity}</span>
              <button
                onClick={() => onUpdateQuantity(1)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-warm-800 text-cream hover:bg-warm-900 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Product Detail ────────────────────────────────────────────────────────────

function ProductDetail({
  product,
  onBack,
  onAddToCart,
  cartQuantity,
  onUpdateQuantity,
}: {
  product: Product;
  onBack: () => void;
  onAddToCart: (qty: number) => void;
  cartQuantity: number;
  onUpdateQuantity: (delta: number) => void;
}) {
  const roastDots = product.roastLevel === 'Light' ? 1 : product.roastLevel === 'Medium' ? 2 : 3;

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-warm-600 hover:text-warm-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to all coffees</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="relative rounded-2xl bg-gradient-to-br from-warm-100 to-warm-200 flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
          <span className="text-[120px] sm:text-[160px]">{product.image}</span>
          <div className="absolute top-4 left-4">
            <span className="badge bg-white/90 text-warm-700 backdrop-blur-sm text-sm">
              {product.roastLevel} Roast
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="mb-1">
            <span className="text-sm text-warm-500 uppercase tracking-wider">{product.category}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-warm-900 mb-2">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 text-warm-500">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{product.origin}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-gold text-gold" />
              <span className="text-sm font-medium text-warm-700">{product.rating}</span>
            </div>
          </div>

          <p className="text-warm-600 leading-relaxed mb-6 text-base">{product.description}</p>

          {/* Flavor Notes */}
          <div className="mb-6">
            <h4 className="text-sm font-bold text-warm-800 uppercase tracking-wider mb-2">Tasting Notes</h4>
            <div className="flex flex-wrap gap-2">
              {product.flavorNotes.map((note) => (
                <span key={note} className="px-3 py-1.5 rounded-full bg-warm-100 text-warm-700 text-sm font-medium">
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-warm-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-warm-500 mb-1">
                <Mountain className="w-3.5 h-3.5" />
                <span className="text-xs uppercase tracking-wider">Altitude</span>
              </div>
              <p className="text-sm font-semibold text-warm-800">{product.altitude}</p>
            </div>
            <div className="bg-warm-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-warm-500 mb-1">
                <Droplets className="w-3.5 h-3.5" />
                <span className="text-xs uppercase tracking-wider">Process</span>
              </div>
              <p className="text-sm font-semibold text-warm-800">{product.process}</p>
            </div>
            <div className="bg-warm-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-warm-500 mb-1">
                <Coffee className="w-3.5 h-3.5" />
                <span className="text-xs uppercase tracking-wider">Weight</span>
              </div>
              <p className="text-sm font-semibold text-warm-800">{product.weight}</p>
            </div>
          </div>

          {/* Roast Level */}
          <div className="mb-8">
            <h4 className="text-sm font-bold text-warm-800 uppercase tracking-wider mb-2">Roast Level</h4>
            <div className="flex items-center gap-3">
              <div className="roast-indicator">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`roast-dot ${i <= roastDots ? 'filled' : ''}`} />
                ))}
              </div>
              <span className="text-sm text-warm-600">{product.roastLevel}</span>
            </div>
          </div>

          {/* Price & Add to Cart */}
          <div className="mt-auto pt-6 border-t border-warm-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-warm-900">${product.price.toFixed(2)}</span>
              <span className="text-sm text-warm-500">per {product.weight}</span>
            </div>
            {cartQuantity === 0 ? (
              <button onClick={() => onAddToCart(1)} className="w-full btn-primary text-base py-3.5">
                Add to Cart
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-warm-100 rounded-xl px-3 py-2 gap-3">
                  <button
                    onClick={() => onUpdateQuantity(-1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-warm-700 hover:bg-warm-200 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-warm-800 text-lg w-8 text-center">{cartQuantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-warm-800 text-cream hover:bg-warm-900 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-warm-500">
                  {(product.price * cartQuantity).toFixed(2)} total
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Cart Panel ────────────────────────────────────────────────────────────────

function CartPanel({
  cart,
  total,
  onClose,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: {
  cart: CartItem[];
  total: number;
  onClose: () => void;
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-warm-200">
        <h2 className="text-xl font-bold text-warm-900 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          Your Cart
        </h2>
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-warm-100 transition-colors"
        >
          <X className="w-5 h-5 text-warm-600" />
        </button>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-6">
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-12 h-12 text-warm-300 mx-auto mb-4" />
            <p className="text-warm-500 text-lg mb-2">Your cart is empty</p>
            <p className="text-sm text-warm-400">Add some delicious coffee to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex gap-4 bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="w-16 h-16 rounded-lg bg-warm-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{item.product.image}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-warm-900 text-sm truncate">{item.product.name}</h4>
                  <p className="text-xs text-warm-500 mt-0.5">{item.product.weight} • {item.product.roastLevel} Roast</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-warm-200 hover:bg-warm-100 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold text-warm-800 w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-warm-200 hover:bg-warm-100 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-bold text-warm-800 text-sm">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(item.product.id)}
                  className="self-start p-1 text-warm-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {cart.length > 0 && (
        <div className="p-6 border-t border-warm-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-warm-500">Subtotal</span>
            <span className="font-medium text-warm-700">${total.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-warm-500">Shipping</span>
            <span className="font-medium text-warm-700">{total >= 50 ? 'Free' : '$5.99'}</span>
          </div>
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-warm-200">
            <span className="font-bold text-warm-900">Total</span>
            <span className="text-xl font-bold text-warm-900">
              ${(total + (total >= 50 ? 0 : 5.99)).toFixed(2)}
            </span>
          </div>
          {total < 50 && (
            <p className="text-xs text-warm-500 mt-2 text-center">
              Add ${(50 - total).toFixed(2)} more for free shipping!
            </p>
          )}
          <button onClick={onCheckout} className="w-full btn-primary text-base py-3.5 mt-4">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Checkout ──────────────────────────────────────────────────────────────────

function Checkout({
  cart,
  total,
  onBack,
  onComplete,
}: {
  cart: CartItem[];
  total: number;
  onBack: () => void;
  onComplete: () => void;
}) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [processing, setProcessing] = useState(false);

  const shipping = total >= 50 ? 0 : 5.99;
  const grandTotal = total + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onComplete();
    }, 2000);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-warm-600 hover:text-warm-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to shop</span>
      </button>

      <h1 className="text-3xl font-bold text-warm-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
          {/* Contact */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-warm-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="your@email.com"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="John Doe"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-warm-900 mb-4">Shipping Address</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1.5">Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="123 Coffee Lane"
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="Portland"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">ZIP Code</label>
                  <input
                    type="text"
                    required
                    value={formData.zip}
                    onChange={(e) => updateField('zip', e.target.value)}
                    placeholder="97201"
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-warm-900 mb-4">Payment Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1.5">Card Number</label>
                <input
                  type="text"
                  required
                  value={formData.cardNumber}
                  onChange={(e) => updateField('cardNumber', e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  className="input-field"
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">Expiry</label>
                  <input
                    type="text"
                    required
                    value={formData.expiry}
                    onChange={(e) => updateField('expiry', e.target.value)}
                    placeholder="MM/YY"
                    className="input-field"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">CVV</label>
                  <input
                    type="text"
                    required
                    value={formData.cvv}
                    onChange={(e) => updateField('cvv', e.target.value)}
                    placeholder="123"
                    className="input-field"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full btn-primary text-base py-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <div className="w-5 h-5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Place Order • ${grandTotal.toFixed(2)}
              </>
            )}
          </button>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold text-warm-900 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warm-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">{item.product.image}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-warm-800 truncate">{item.product.name}</p>
                    <p className="text-xs text-warm-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-warm-800">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-warm-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-warm-500">Subtotal</span>
                <span className="text-warm-700">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-warm-500">Shipping</span>
                <span className="text-warm-700">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-warm-900 pt-2 border-t border-warm-200">
                <span>Total</span>
                <span className="text-lg">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Confirmation ──────────────────────────────────────────────────────────────

function Confirmation({ onBackToShop }: { onBackToShop: () => void }) {
  return (
    <div className="max-w-lg mx-auto text-center py-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
        className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
      >
        <Check className="w-10 h-10 text-green-600" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-warm-900 mb-3">Order Confirmed!</h1>
        <p className="text-warm-600 text-lg mb-2">
          Thank you for your purchase. Your exceptional coffee is on its way.
        </p>
        <p className="text-warm-500 text-sm mb-8">
          A confirmation email has been sent. You'll receive tracking details once your order ships.
        </p>
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <p className="text-sm text-warm-500 mb-1">Order Number</p>
          <p className="text-xl font-bold text-warm-900 font-mono">
            #EB-{Math.random().toString(36).substring(2, 8).toUpperCase()}
          </p>
        </div>
        <button onClick={onBackToShop} className="btn-primary text-base py-3 px-8">
          Continue Shopping
        </button>
      </motion.div>
    </div>
  );
}
