import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UtensilsCrossed, FileText, Star, MessageSquare, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

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

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    blogs: 0,
    reviews: 0,
    messages: 0
  });
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [products, blogs, reviews, messages] = await Promise.all([
        axios.get(`${API}/products`, { withCredentials: true }),
        axios.get(`${API}/blogs/all`, { withCredentials: true }),
        axios.get(`${API}/reviews/all`, { withCredentials: true }),
        axios.get(`${API}/contacts`, { withCredentials: true })
      ]);

      setStats({
        products: products.data.length,
        blogs: blogs.data.length,
        reviews: reviews.data.length,
        messages: messages.data.length
      });

      setRecentMessages(messages.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    { title: 'Total Products', value: stats.products, icon: UtensilsCrossed, link: '/admin/products', color: 'text-green-400' },
    { title: 'Blog Posts', value: stats.blogs, icon: FileText, link: '/admin/blogs', color: 'text-blue-400' },
    { title: 'Reviews', value: stats.reviews, icon: Star, link: '/admin/reviews', color: 'text-yellow-400' },
    { title: 'Messages', value: stats.messages, icon: MessageSquare, link: '/admin/messages', color: 'text-purple-400' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-cream mb-2">Dashboard</h1>
        <p className="text-cream/60">Welcome to Panshi Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {statCards.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Link to={stat.link}>
              <Card className="bg-surface/40 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-cream/60 text-sm mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-cream">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full bg-surface flex items-center justify-center ${stat.color}`}>
                      <stat.icon size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions & Recent Messages */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-surface/40 border-primary/20">
            <CardHeader>
              <CardTitle className="font-serif text-xl text-cream flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                to="/admin/products"
                data-testid="quick-add-product"
                className="block p-4 bg-background/50 rounded-lg hover:bg-background/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <UtensilsCrossed className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-cream font-medium">Add New Product</p>
                    <p className="text-cream/50 text-sm">Create a new menu item</p>
                  </div>
                </div>
              </Link>
              <Link
                to="/admin/blogs"
                data-testid="quick-add-blog"
                className="block p-4 bg-background/50 rounded-lg hover:bg-background/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-cream font-medium">Write Blog Post</p>
                    <p className="text-cream/50 text-sm">Share your culinary stories</p>
                  </div>
                </div>
              </Link>
              <Link
                to="/admin/reviews"
                data-testid="quick-view-reviews"
                className="block p-4 bg-background/50 rounded-lg hover:bg-background/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-cream font-medium">Manage Reviews</p>
                    <p className="text-cream/50 text-sm">Approve customer feedback</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-surface/40 border-primary/20">
            <CardHeader>
              <CardTitle className="font-serif text-xl text-cream flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentMessages.length === 0 ? (
                <p className="text-cream/50 text-center py-8">No messages yet</p>
              ) : (
                <div className="space-y-4">
                  {recentMessages.map((msg) => (
                    <div key={msg.id} className="p-4 bg-background/50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-cream font-medium">{msg.name}</p>
                        <p className="text-cream/50 text-xs">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-cream/70 text-sm line-clamp-2">{msg.message}</p>
                      <p className="text-primary text-sm mt-2">{msg.phone}</p>
                    </div>
                  ))}
                </div>
              )}
              {recentMessages.length > 0 && (
                <Link
                  to="/admin/messages"
                  className="block text-center text-primary hover:underline mt-4"
                >
                  View All Messages →
                </Link>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
