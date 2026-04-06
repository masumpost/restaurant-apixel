import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Search, X } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API}/categories`);
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      
      const { data } = await axios.get(`${API}/products?${params}`);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const orderOnWhatsApp = (product) => {
    const message = `Hi! I want to order: ${product.name_en} - ৳${product.price}. Please confirm.`;
    window.open(`https://wa.me/8801322411534?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>Menu | Panshi Restaurants And Hotel</title>
        <meta name="description" content="Browse our menu of authentic Bengali dishes. Kacchi Biryani, curries, kebabs, desserts and more. Order via WhatsApp!" />
        <meta property="og:title" content="Menu | Panshi Restaurants" />
        <meta property="og:description" content="Authentic Bengali cuisine - Biryani, curries, kebabs, and traditional desserts." />
      </Helmet>

      <div className="min-h-screen pt-24 pb-32 md:pb-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <p className="text-primary text-sm uppercase tracking-[0.2em] mb-4">Our Menu</p>
            <h1 className="font-serif text-4xl sm:text-5xl text-cream mb-4">Delicious Dishes</h1>
            <p className="text-cream/60 max-w-2xl mx-auto">
              Explore our carefully crafted menu of authentic Bengali cuisine. 
              From aromatic biryanis to succulent kebabs.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-md mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/40 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="menu-search"
                className="pl-12 pr-10 py-3 bg-surface/40 border-primary/20 text-cream placeholder:text-cream/40 focus:border-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent h-auto p-0">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    data-testid={`category-${category.toLowerCase()}`}
                    className="px-6 py-2.5 rounded-full border border-primary/30 text-cream/70 data-[state=active]:bg-primary data-[state=active]:text-background data-[state=active]:border-primary transition-colors"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-surface/40 rounded-t-lg" />
                  <div className="p-6 bg-surface/20 rounded-b-lg">
                    <div className="h-6 bg-surface/40 rounded mb-2" />
                    <div className="h-4 bg-surface/40 rounded w-2/3 mb-4" />
                    <div className="h-4 bg-surface/40 rounded mb-4" />
                    <div className="flex justify-between">
                      <div className="h-8 bg-surface/40 rounded w-20" />
                      <div className="h-8 bg-surface/40 rounded w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-cream/60 text-lg">No dishes found matching your criteria.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="mt-4 text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <Card className="bg-surface/40 border-primary/20 overflow-hidden card-hover h-full flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name_en}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        loading="lazy"
                      />
                      {!product.in_stock && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <Badge variant="destructive" className="text-lg px-4 py-1">
                            Out of Stock
                          </Badge>
                        </div>
                      )}
                      <Badge className="absolute top-3 left-3 bg-primary text-background">
                        {product.category}
                      </Badge>
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <h3 className="font-serif text-xl text-cream mb-1">{product.name_en}</h3>
                      <p className="text-primary text-sm mb-2">{product.name_bn}</p>
                      <p className="text-cream/60 text-sm mb-4 line-clamp-2 flex-1">{product.description}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-2xl font-bold text-primary">৳{product.price}</span>
                        <button
                          onClick={() => orderOnWhatsApp(product)}
                          disabled={!product.in_stock}
                          data-testid={`menu-order-${product.id}`}
                          className="px-4 py-2 bg-whatsapp text-white text-sm font-bold uppercase tracking-wider rounded-full hover:bg-whatsapp/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Order
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
