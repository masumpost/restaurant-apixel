import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ChefHat, Truck, Leaf, BadgeDollarSign, Star, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const HERO_BG = "https://static.prod-images.emergentagent.com/jobs/3330e33a-96b1-42f2-92f1-58cb71a063d6/images/e094072f91b5cd08500507d024961645151601df1495c51abb2f8001bb334f2c.png";

const features = [
  { icon: Leaf, title: 'Fresh Ingredients', desc: 'Sourced daily from local markets' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Hot food at your doorstep' },
  { icon: ChefHat, title: 'Authentic Taste', desc: 'Traditional Bengali recipes' },
  { icon: BadgeDollarSign, title: 'Best Prices', desc: 'Quality food, fair prices' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchReviews();
  }, []);

  useEffect(() => {
    if (products.length === 0 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.max(1, products.length - 2));
    }, 3000);
    return () => clearInterval(interval);
  }, [products, isPaused]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API}/products`);
      setProducts(data.slice(0, 8));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${API}/reviews`);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % Math.max(1, products.length - 2));
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + Math.max(1, products.length - 2)) % Math.max(1, products.length - 2));

  const orderOnWhatsApp = (product) => {
    const message = `Hi! I want to order: ${product.name_en} - ৳${product.price}. Please confirm.`;
    window.open(`https://wa.me/8801322411534?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>Panshi Restaurants And Hotel | পানসি রেস্টুরেন্টস অ্যান্ড হোটেল | Authentic Bengali Cuisine</title>
        <meta name="description" content="Panshi Restaurants And Hotel - Authentic Bengali cuisine in Dhaka. Order delicious Kacchi Biryani, Bengali curries, and traditional desserts via WhatsApp." />
        <meta property="og:title" content="Panshi Restaurants And Hotel | Authentic Bengali Cuisine" />
        <meta property="og:description" content="Order delicious Bengali food via WhatsApp. Kacchi Biryani, curries, kebabs and more." />
        <meta property="og:image" content={HERO_BG} />
        <link rel="canonical" href="https://panshi-dining.preview.emergentagent.com" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            "name": "Panshi Restaurants And Hotel",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "8 No Road",
              "addressLocality": "Dhaka",
              "addressCountry": "Bangladesh"
            },
            "telephone": "+8801322411534",
            "servesCuisine": "Bangladeshi",
            "priceRange": "৳৳"
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 parallax-bg"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Floating food particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-primary/30 rounded-full"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl text-cream mb-4 tracking-tight">
              Panshi Restaurants
            </h1>
            <p className="font-serif text-2xl sm:text-3xl text-primary mb-2">
              পানসি রেস্টুরেন্টস অ্যান্ড হোটেল
            </p>
            <p className="text-cream/70 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
              Authentic Bengali Cuisine • Traditional Recipes • Made with Love
            </p>
            <a
              href="https://wa.me/8801322411534?text=Hello,%20I'd%20like%20to%20place%20an%20order!"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="hero-order-btn"
              className="inline-block px-10 py-4 bg-primary text-background font-bold text-lg uppercase tracking-wider rounded-full hover:bg-primary-hover transition-all btn-glow"
            >
              Order on WhatsApp
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-cream/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-primary rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-surface/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.p variants={itemVariants} className="text-primary text-sm uppercase tracking-[0.2em] mb-4">
              Our Promise
            </motion.p>
            <motion.h2 variants={itemVariants} className="font-serif text-3xl sm:text-4xl lg:text-5xl text-cream">
              Why Choose Us?
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center p-6 bg-surface/40 rounded-lg border border-primary/20 card-hover"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-lg text-cream mb-2">{feature.title}</h3>
                <p className="text-cream/60 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Dishes Carousel */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-primary text-sm uppercase tracking-[0.2em] mb-2">Our Specialties</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-cream">Featured Dishes</h2>
            </div>
            <div className="hidden sm:flex gap-2">
              <button
                onClick={prevSlide}
                data-testid="carousel-prev"
                className="p-3 rounded-full border border-primary/30 text-cream hover:bg-primary hover:text-background transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                data-testid="carousel-next"
                className="p-3 rounded-full border border-primary/30 text-cream hover:bg-primary hover:text-background transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div 
            className="overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <motion.div
              className="flex gap-6"
              animate={{ x: `-${currentSlide * (100 / 3)}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="min-w-[280px] md:min-w-[350px] flex-shrink-0"
                >
                  <Card className="bg-surface/40 border-primary/20 overflow-hidden card-hover">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name_en}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-serif text-xl text-cream mb-1">{product.name_en}</h3>
                      <p className="text-primary text-sm mb-2">{product.name_bn}</p>
                      <p className="text-cream/60 text-sm mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">৳{product.price}</span>
                        <button
                          onClick={() => orderOnWhatsApp(product)}
                          data-testid={`order-${product.id}`}
                          className="px-4 py-2 bg-whatsapp text-white text-sm font-bold uppercase tracking-wider rounded-full hover:bg-whatsapp/90 transition-colors"
                        >
                          Order
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/menu"
              data-testid="view-full-menu"
              className="inline-block px-8 py-3 border-2 border-primary text-primary font-bold uppercase tracking-wider rounded-full hover:bg-primary hover:text-background transition-colors"
            >
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-surface/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.p variants={itemVariants} className="text-primary text-sm uppercase tracking-[0.2em] mb-4">
              Testimonials
            </motion.p>
            <motion.h2 variants={itemVariants} className="font-serif text-3xl sm:text-4xl lg:text-5xl text-cream">
              What Our Customers Say
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                variants={itemVariants}
                className="p-6 bg-surface/40 rounded-lg border border-primary/20"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < review.rating ? 'text-primary fill-primary' : 'text-cream/20'}
                    />
                  ))}
                </div>
                <p className="text-cream/80 text-sm mb-4 italic">"{review.comment}"</p>
                <p className="text-primary font-medium">{review.reviewer_name}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={itemVariants}>
              <p className="text-primary text-sm uppercase tracking-[0.2em] mb-4">Find Us</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-cream mb-6">Visit Our Restaurant</h2>
              <div className="space-y-4 text-cream/70">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <p>8 No Road, Dhaka, Bangladesh</p>
                </div>
                <p>Open daily from 10:00 AM to 11:00 PM</p>
                <p>Call us: <a href="tel:+8801322411534" className="text-primary hover:underline">+880 1322-411534</a></p>
              </div>
              <a
                href="https://wa.me/8801322411534?text=Hello,%20I'd%20like%20to%20place%20an%20order!"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-whatsapp text-white font-bold uppercase tracking-wider rounded-full hover:bg-whatsapp/90 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Order Now
              </a>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="rounded-lg overflow-hidden border border-primary/20"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.8987684940893!2d90.39945531498168!3d23.75093709459285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Panshi Restaurant Location"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
