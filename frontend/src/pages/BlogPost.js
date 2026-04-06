import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Calendar, User, ArrowLeft, Facebook, Share2 } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const { data } = await axios.get(`${API}/blogs/${slug}`);
      setBlog(data);
    } catch (error) {
      setError('Blog post not found');
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

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      '_blank'
    );
  };

  const shareOnWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`Check out this article: ${blog.title} - ${window.location.href}`)}`,
      '_blank'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-6 md:px-12">
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="h-8 bg-surface/40 rounded w-3/4 mb-4" />
          <div className="h-4 bg-surface/40 rounded w-1/2 mb-8" />
          <div className="aspect-video bg-surface/40 rounded-lg mb-8" />
          <div className="space-y-4">
            <div className="h-4 bg-surface/40 rounded" />
            <div className="h-4 bg-surface/40 rounded" />
            <div className="h-4 bg-surface/40 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-6 md:px-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-cream mb-4">Post Not Found</h1>
          <p className="text-cream/60 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background font-bold rounded-full hover:bg-primary-hover transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{blog.title} | Panshi Restaurants Blog</title>
        <meta name="description" content={blog.content.replace(/<[^>]+>/g, '').substring(0, 160)} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.content.replace(/<[^>]+>/g, '').substring(0, 160)} />
        <meta property="og:image" content={blog.thumbnail_url} />
        <meta property="og:url" content={window.location.href} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="min-h-screen pt-24 pb-32 md:pb-12 px-6 md:px-12">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Back Link */}
          <Link
            to="/blog"
            data-testid="back-to-blog"
            className="inline-flex items-center gap-2 text-cream/60 hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft size={18} />
            Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-cream mb-4">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-cream/50">
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                {formatDate(blog.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <User size={16} />
                {blog.author}
              </span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="aspect-video rounded-lg overflow-hidden mb-8 border border-primary/20">
            <img
              src={blog.thumbnail_url}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div
            className="prose prose-invert prose-lg max-w-none mb-12
              prose-headings:font-serif prose-headings:text-cream
              prose-p:text-cream/70 prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-cream
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Share Buttons */}
          <div className="border-t border-primary/20 pt-8">
            <p className="text-cream/60 mb-4">Share this article:</p>
            <div className="flex gap-4">
              <button
                onClick={shareOnFacebook}
                data-testid="share-facebook"
                className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Facebook size={18} />
                Facebook
              </button>
              <button
                onClick={shareOnWhatsApp}
                data-testid="share-whatsapp"
                className="flex items-center gap-2 px-4 py-2 bg-whatsapp text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Share2 size={18} />
                WhatsApp
              </button>
            </div>
          </div>
        </motion.article>
      </div>
    </>
  );
}
