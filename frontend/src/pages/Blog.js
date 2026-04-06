import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

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

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get(`${API}/blogs`);
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getExcerpt = (content) => {
    const text = content.replace(/<[^>]+>/g, '');
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  };

  return (
    <>
      <Helmet>
        <title>Blog | Panshi Restaurants And Hotel</title>
        <meta name="description" content="Read our blog for Bengali cuisine tips, recipes, and restaurant news from Panshi." />
        <meta property="og:title" content="Blog | Panshi Restaurants" />
        <meta property="og:description" content="Bengali cuisine tips, recipes, and restaurant news." />
      </Helmet>

      <div className="min-h-screen pt-24 pb-32 md:pb-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <p className="text-primary text-sm uppercase tracking-[0.2em] mb-4">Our Stories</p>
            <h1 className="font-serif text-4xl sm:text-5xl text-cream mb-4">From Our Kitchen</h1>
            <p className="text-cream/60 max-w-2xl mx-auto">
              Discover the stories behind our dishes, cooking tips, and restaurant updates.
            </p>
          </motion.div>

          {/* Blog Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video bg-surface/40 rounded-t-lg" />
                  <div className="p-6 bg-surface/20 rounded-b-lg">
                    <div className="h-6 bg-surface/40 rounded mb-4" />
                    <div className="h-4 bg-surface/40 rounded mb-2" />
                    <div className="h-4 bg-surface/40 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-cream/60 text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {blogs.map((blog) => (
                <motion.div key={blog.id} variants={itemVariants}>
                  <Card className="bg-surface/40 border-primary/20 overflow-hidden card-hover h-full flex flex-col">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={blog.thumbnail_url}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-sm text-cream/50 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(blog.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {blog.author}
                        </span>
                      </div>
                      <h2 className="font-serif text-xl text-cream mb-3 hover:text-primary transition-colors">
                        <Link to={`/blog/${blog.slug}`} data-testid={`blog-${blog.slug}`}>
                          {blog.title}
                        </Link>
                      </h2>
                      <p className="text-cream/60 text-sm mb-4 flex-1">
                        {getExcerpt(blog.content)}
                      </p>
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                      >
                        Read More <ArrowRight size={16} />
                      </Link>
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
