import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail, Package, ShoppingBag, User } from 'lucide-react';
import AuthShell from '../components/AuthShell.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const strengthLabels = ['Too short', 'Weak', 'Fair', 'Strong', 'Excellent'];

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const authReason = location.state?.reason;

  const strength = useMemo(() => {
    const password = form.password;
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return Math.min(score, 4);
  }, [form.password]);

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address.';
    }
    if (form.password.length < 8) next.password = 'Use at least 8 characters.';
    if (form.password !== form.confirm) next.confirm = 'Passwords do not match.';
    if (!terms) next.terms = 'Please accept the terms to continue.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    setApiError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      const user = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      const buyNow = location.state?.buyNow;
      if (buyNow?.product) addToCart(buyNow.product, buyNow.qty || 1);
      const redirectTo = location.state?.from
        ? `${location.state.from.pathname || '/'}${location.state.from.search || ''}`
        : '/';
      toast(`Welcome to ShopVista, ${user.name.split(' ')[0]}.`, 'success');
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

  return (
    <AuthShell
      eyebrow="Join ShopVista"
      title="Create your account"
      subtitle="One account for your bag, wishlist and every order."
      footer={
        <p>
          Already have an account? <Link to="/login" state={location.state}>Sign in</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={submit} noValidate>
        {authReason === 'purchase' && (
          <div className="form-banner form-banner--info" role="status">
            <ShoppingBag size={17} />
            <span>Create an account to complete your purchase. Your bag is saved.</span>
          </div>
        )}

        {authReason === 'account' && (
          <div className="form-banner form-banner--info" role="status">
            <Package size={17} />
            <span>Create an account to view your orders.</span>
          </div>
        )}

        {apiError && (
          <div className="form-banner" role="alert">
            <AlertCircle size={17} />
            <span>{apiError}</span>
          </div>
        )}

        <label className={`field ${errors.name ? 'has-error' : ''}`}>
          <span>Full name</span>
          <div className="input-icon">
            <User size={17} />
            <input
              type="text"
              value={form.name}
              onChange={update('name')}
              placeholder="Alex Morgan"
              autoComplete="name"
            />
          </div>
          {errors.name && <em>{errors.name}</em>}
        </label>

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
              placeholder="At least 8 characters"
              autoComplete="new-password"
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
          {form.password && (
            <span className={`strength strength--${strength}`}>
              <span className="strength__bars">
                {Array.from({ length: 4 }).map((_, index) => (
                  <i key={index} className={index < strength ? 'is-on' : ''} />
                ))}
              </span>
              {strengthLabels[strength]}
            </span>
          )}
          {errors.password && <em>{errors.password}</em>}
        </label>

        <label className={`field ${errors.confirm ? 'has-error' : ''}`}>
          <span>Confirm password</span>
          <div className="input-icon">
            <Lock size={17} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.confirm}
              onChange={update('confirm')}
              placeholder="Repeat your password"
              autoComplete="new-password"
            />
          </div>
          {errors.confirm && <em>{errors.confirm}</em>}
        </label>

        <label className={`check ${errors.terms ? 'has-error' : ''}`}>
          <input
            type="checkbox"
            checked={terms}
            onChange={(event) => {
              setTerms(event.target.checked);
              setErrors((current) => ({ ...current, terms: undefined }));
            }}
          />
          <span>
            I agree to the <a href="#terms">terms of service</a> and{' '}
            <a href="#privacy">privacy policy</a>.
          </span>
        </label>
        {errors.terms && <em className="field-error">{errors.terms}</em>}

        <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={submitting}>
          {submitting ? (
            <>
              <span className="spinner spinner--sm" /> Creating account...
            </>
          ) : (
            <>
              Create account <ArrowRight size={17} />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
