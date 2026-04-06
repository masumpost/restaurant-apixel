import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const LOGO_URL = "https://static.prod-images.emergentagent.com/jobs/3330e33a-96b1-42f2-92f1-58cb71a063d6/images/e13015c09058157c7450da00998284b591ee87bef11acd270db7e3b77b23fb66.png";

function formatApiErrorDetail(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (error) {
      const errorMessage = formatApiErrorDetail(error.response?.data?.detail) || error.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | Panshi Restaurants</title>
      </Helmet>

      <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex flex-col items-center mb-8">
            <img src={LOGO_URL} alt="Panshi" className="h-20 w-auto mb-4" />
            <h1 className="font-serif text-2xl text-cream">Panshi Admin</h1>
          </Link>

          <Card className="bg-surface/40 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="font-serif text-2xl text-cream">Welcome Back</CardTitle>
              <p className="text-cream/60 text-sm mt-2">Sign in to access the admin panel</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-cream/70 mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@restaurant.com"
                    data-testid="login-email"
                    className="bg-background/50 border-primary/20 text-cream placeholder:text-cream/40 focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-cream/70 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      data-testid="login-password"
                      className="bg-background/50 border-primary/20 text-cream placeholder:text-cream/40 focus:border-primary pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/50 hover:text-cream"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  data-testid="login-submit"
                  className="w-full bg-primary text-background hover:bg-primary-hover font-bold uppercase tracking-wider py-6"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-cream/50 text-sm mt-6">
            <Link to="/" className="text-primary hover:underline">
              ← Back to Restaurant
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
