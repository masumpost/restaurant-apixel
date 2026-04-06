import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { MapPin, Phone, Clock, Send, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API}/contacts`, formData);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Panshi Restaurants And Hotel</title>
        <meta name="description" content="Get in touch with Panshi Restaurants. Call us, visit us, or send a message. We'd love to hear from you!" />
        <meta property="og:title" content="Contact Us | Panshi Restaurants" />
        <meta property="og:description" content="Get in touch with us!" />
      </Helmet>

      <div className="min-h-screen pt-24 pb-32 md:pb-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <p className="text-primary text-sm uppercase tracking-[0.2em] mb-4">Get in Touch</p>
            <h1 className="font-serif text-4xl sm:text-5xl text-cream mb-4">Contact Us</h1>
            <p className="text-cream/60 max-w-2xl mx-auto">
              Have a question or want to make a reservation? We'd love to hear from you!
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <Card className="bg-surface/40 border-primary/20">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-cream flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    Our Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-cream/70">8 No Road, Dhaka, Bangladesh</p>
                </CardContent>
              </Card>

              <Card className="bg-surface/40 border-primary/20">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-cream flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    Phone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a 
                    href="tel:+8801322411534" 
                    className="text-primary hover:underline text-lg"
                    data-testid="contact-phone"
                  >
                    +880 1322-411534
                  </a>
                  <p className="text-cream/50 text-sm mt-2">Click to call us directly</p>
                </CardContent>
              </Card>

              <Card className="bg-surface/40 border-primary/20">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-cream flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    Opening Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-cream/70">
                    <div className="flex justify-between">
                      <span>Monday - Sunday</span>
                      <span>10:00 AM - 11:00 PM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/8801322411534?text=Hello,%20I'd%20like%20to%20make%20an%20inquiry."
                target="_blank"
                rel="noopener noreferrer"
                data-testid="contact-whatsapp"
                className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-whatsapp text-white font-bold uppercase tracking-wider rounded-lg hover:bg-whatsapp/90 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>

              {/* Map */}
              <div className="rounded-lg overflow-hidden border border-primary/20">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.8987684940893!2d90.39945531498168!3d23.75093709459285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Panshi Restaurant Location"
                />
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-surface/40 border-primary/20">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-cream">Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-cream/70 mb-2">
                        Your Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        data-testid="contact-name"
                        className="bg-background/50 border-primary/20 text-cream placeholder:text-cream/40 focus:border-primary"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-cream/70 mb-2">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        data-testid="contact-phone-input"
                        className="bg-background/50 border-primary/20 text-cream placeholder:text-cream/40 focus:border-primary"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-cream/70 mb-2">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        rows={5}
                        data-testid="contact-message"
                        className="bg-background/50 border-primary/20 text-cream placeholder:text-cream/40 focus:border-primary resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      data-testid="contact-submit"
                      className="w-full bg-primary text-background hover:bg-primary-hover font-bold uppercase tracking-wider py-6"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
