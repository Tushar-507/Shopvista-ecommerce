import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail, Package, ShoppingBag } from 'lucide-react';
import AuthShell from '../components/AuthShell.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const authReason = location.state?.reason;

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address.';
    }
    if (form.password.length < 6) {
      next.password = 'Password must be at least 6 characters.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    setApiError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      const user = await login({ email: form.email.trim(), password: form.password });
      const buyNow = location.state?.buyNow;
      if (buyNow?.product) addToCart(buyNow.product, buyNow.qty || 1);
      const redirectTo = location.state?.from
        ? `${location.state.from.pathname || '/'}${location.state.from.search || ''}`
        : '/';
      toast(`Welcome back, ${user.name.split(' ')[0]}.`, 'success');
      navigate(buyNow ? '/checkout' : redirectTo, { replace: true });
    } catch (error) {
      setApiError(
        error.status === 0
          ? 'The ShopVista API is offline. Start the server, then try again.'
          : error.message,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const useDemo = () => {
    setForm({ email: 'demo@shopvista.com', password: 'shopvista123' });
    setErrors({});
    setApiError('');
    toast('Demo credentials filled in.', 'info');
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to ShopVista"
      subtitle="Your bag, wishlist and orders are waiting for you."
      footer={
        <p>
          New to ShopVista? <Link to="/signup" state={location.state}>Create an account</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={submit} noValidate>
        {authReason === 'purchase' && (
          <div className="form-banner form-banner--info" role="status">
            <ShoppingBag size={17} />
            <span>Sign in to complete your purchase. Your bag is saved.</span>
          </div>
        )}

        {authReason === 'account' && (
          <div className="form-banner form-banner--info" role="status">
            <Package size={17} />
            <span>Sign in to view your orders.</span>
          </div>
        )}

        {apiError && (
          <div className="form-banner" role="alert">
            <AlertCircle size={17} />
            <span>{apiError}</span>
          </div>
        )}

        <label className={`field ${errors.email ? 'has-error' : ''}`}>
          <span>Email address</span>
          <div className="input-icon">
            <Mail size={17} />
            <input
              type="email"
              value={form.email}
              onChange={update('email')}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          {errors.email && <em>{errors.email}</em>}
        </label>

        <label className={`field ${errors.password ? 'has-error' : ''}`}>
          <span>Password</span>
          <div className="input-icon">
            <Lock size={17} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={update('password')}
              placeholder="Your password"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="input-icon__toggle"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && <em>{errors.password}</em>}
        </label>

        <div className="auth-form__row">
          <label className="check">
            <input type="checkbox" defaultChecked />
            <span>Remember me</span>
          </label>
          <button
            type="button"
            className="text-link text-link--button"
            onClick={() => toast('Password reset is not enabled in this demo.', 'info')}
          >
            Forgot password?
          </button>
        </div>

        <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={submitting}>
          {submitting ? (
            <>
              <span className="spinner spinner--sm" /> Signing in...
            </>
          ) : (
            <>
              Sign in <ArrowRight size={17} />
            </>
          )}
        </button>

        <button type="button" className="demo-hint" onClick={useDemo}>
          <span>Demo account</span>
          demo@shopvista.com · shopvista123
        </button>
      </form>
    </AuthShell>
  );
}
