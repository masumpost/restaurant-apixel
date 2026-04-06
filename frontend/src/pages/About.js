import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Award, Users, Heart } from 'lucide-react';

const INTERIOR_1 = "https://images.unsplash.com/photo-1756981168649-0e3c3c8a32f3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBkYXJrJTIwZ3JlZW4lMjBnb2xkJTIwbHV4dXJ5fGVufDB8fHx8MTc3NTQ2NDUxOXww&ixlib=rb-4.1.0&q=85";
const INTERIOR_2 = "https://images.unsplash.com/photo-1661422586023-681ea60507e2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwyfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBkYXJrJTIwZ3JlZW4lMjBnb2xkJTIwbHV4dXJ5fGVufDB8fHx8MTc3NTQ2NDUxOXww&ixlib=rb-4.1.0&q=85";

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

const stats = [
  { icon: Award, value: '10+', label: 'Years of Excellence' },
  { icon: Users, value: '50K+', label: 'Happy Customers' },
  { icon: Heart, value: '100+', label: 'Signature Dishes' },
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | Panshi Restaurants And Hotel</title>
        <meta name="description" content="Learn about Panshi Restaurants And Hotel - Our story, our team, and our passion for authentic Bengali cuisine in Dhaka." />
        <meta property="og:title" content="About Us | Panshi Restaurants" />
        <meta property="og:description" content="Our story of authentic Bengali cuisine." />
      </Helmet>

      <div className="min-h-screen pt-24 pb-32 md:pb-12">
        {/* Hero Section */}
        <section className="relative py-24 px-6 md:px-12 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img src={INTERIOR_1} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative max-w-4xl mx-auto text-center"
          >
            <p className="text-primary text-sm uppercase tracking-[0.2em] mb-4">Our Story</p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream mb-6">
              পানসি রেস্টুরেন্টস অ্যান্ড হোটেল
            </h1>
            <p className="text-cream/70 text-lg max-w-2xl mx-auto">
              A journey of passion, tradition, and authentic Bengali flavors since 2015.
            </p>
          </motion.div>
        </section>

        {/* Story Section */}
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              <motion.div variants={itemVariants}>
                <h2 className="font-serif text-3xl sm:text-4xl text-cream mb-6">
                  Our Heritage
                </h2>
                <div className="space-y-4 text-cream/70">
                  <p>
                    Panshi Restaurants And Hotel was born from a simple dream - to bring the authentic 
                    flavors of Bengali cuisine to the heart of Dhaka. What started as a small family 
                    kitchen has grown into a beloved culinary destination.
                  </p>
                  <p>
                    Our recipes have been passed down through generations, each dish carrying the 
                    warmth and love of traditional Bengali cooking. From our signature Kacchi Biryani 
                    to our aromatic curries, every plate tells a story.
                  </p>
                  <p>
                    Today, we continue our commitment to quality, using only the freshest ingredients 
                    and time-honored cooking techniques to create meals that feel like home.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="relative"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <img
                      src={INTERIOR_1}
                      alt="Restaurant Interior"
                      className="rounded-lg border border-primary/20"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400"
                      alt="Our Food"
                      className="rounded-lg border border-primary/20"
                    />
                  </div>
                  <div className="pt-8 space-y-4">
                    <img
                      src="https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400"
                      alt="Chef Cooking"
                      className="rounded-lg border border-primary/20"
                    />
                    <img
                      src={INTERIOR_2}
                      alt="Dining Area"
                      className="rounded-lg border border-primary/20"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-6 md:px-12 bg-surface/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="grid grid-cols-3 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center"
                >
                  <stat.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="font-serif text-4xl text-cream mb-2">{stat.value}</p>
                  <p className="text-cream/60">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="text-primary text-sm uppercase tracking-[0.2em] mb-4">Our Team</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-cream">
                Meet the Culinary Artists
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                { name: 'Abdul Karim', role: 'Head Chef', img: 'https://images.unsplash.com/photo-1583394293214-28ez9c7a0e7e?w=300' },
                { name: 'Fatima Rahman', role: 'Pastry Chef', img: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=300' },
                { name: 'Hassan Ali', role: 'Sous Chef', img: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300' },
              ].map((member, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center"
                >
                  <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary/20">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=1B4332&color=F4A623&size=200`;
                      }}
                    />
                  </div>
                  <h3 className="font-serif text-xl text-cream mb-1">{member.name}</h3>
                  <p className="text-primary">{member.role}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Location Section */}
        <section className="py-24 px-6 md:px-12 bg-surface/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              <motion.div variants={itemVariants}>
                <p className="text-primary text-sm uppercase tracking-[0.2em] mb-4">Visit Us</p>
                <h2 className="font-serif text-3xl sm:text-4xl text-cream mb-8">
                  Find Our Restaurant
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg text-cream mb-1">Address</h4>
                      <p className="text-cream/60">8 No Road, Dhaka, Bangladesh</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg text-cream mb-1">Phone</h4>
                      <a href="tel:+8801322411534" className="text-primary hover:underline">
                        +880 1322-411534
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-serif text-lg text-cream mb-1">Opening Hours</h4>
                      <p className="text-cream/60">Daily: 10:00 AM - 11:00 PM</p>
                    </div>
                  </div>
                </div>
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
      </div>
    </>
  );
}
