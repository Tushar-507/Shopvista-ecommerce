import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Lock,
  Package,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Wallet,
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { createOrder } from '../services/api.js';
import { formatPrice } from '../utils/format.js';

const EMPTY_FORM = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  country: 'United States',
  paymentMethod: 'card',
  cardNumber: '',
  expiry: '',
  cvc: '',
};

const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'India'];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Checkout() {
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!user) return;
    setForm((current) => ({
      ...current,
      fullName: current.fullName || user.name || '',
      email: current.email || user.email || '',
    }));
  }, [user]);

  const update = (key) => (event) => {
    let value = event.target.value;
    if (key === 'cardNumber') {
      value = value
        .replace(/\D/g, '')
        .slice(0, 16)
        .replace(/(.{4})/g, '$1 ')
        .trim();
    }
    if (key === 'expiry') {
      value = value
        .replace(/\D/g, '')
        .slice(0, 4)
        .replace(/^(\d{2})(\d)/, '$1/$2');
    }
    if (key === 'cvc') value = value.replace(/\D/g, '').slice(0, 4);
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (form.fullName.trim().length < 2) next.fullName = 'Please enter your full name.';
    if (!emailPattern.test(form.email.trim())) next.email = 'Enter a valid email address.';
    if (form.phone.replace(/\D/g, '').length < 7) next.phone = 'Enter a reachable phone number.';
    if (form.address.trim().length < 5) next.address = 'Enter your street address.';
    if (form.city.trim().length < 2) next.city = 'Enter your city.';
    if (form.postalCode.trim().length < 3) next.postalCode = 'Enter a valid postal code.';
    if (!form.country) next.country = 'Select a country.';
    if (form.paymentMethod === 'card') {
      if (form.cardNumber.replace(/\s/g, '').length !== 16) {
        next.cardNumber = 'Enter a 16-digit card number.';
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) {
        next.expiry = 'Use MM/YY format.';
      }
      if (!/^\d{3,4}$/.test(form.cvc)) next.cvc = 'Enter the 3 or 4 digit code.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    setApiError('');
    if (!validate()) return;
    setSubmitting(true);

    try {
      const data = await createOrder({
        items: items.map(({ product, qty }) => ({ productId: product.id, qty })),
        customer: { email: form.email.trim(), phone: form.phone.trim() },
        shippingAddress: {
          fullName: form.fullName.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          postalCode: form.postalCode.trim(),
          country: form.country,
        },
        paymentMethod: form.paymentMethod === 'card' ? 'Card' : 'Cash on delivery',
      });
      setOrder(data.order);
      clearCart();
      toast('Order placed. A confirmation is on its way.', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setApiError(
        error.status === 0
          ? 'The ShopVista API is offline. Start the server with "npm run dev" in the server folder, then try again.'
          : error.message,
      );
      toast('We could not place your order.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.qty, 0), [items]);

  if (order) {
    return (
      <div className="page">
        <div className="container">
          <div className="order-success">
            <span className="order-success__icon">
              <CheckCircle2 size={34} />
            </span>
            <span className="eyebrow">Thank you</span>
            <h1>Your order is confirmed</h1>
            <p>
              We are getting everything ready for you, {order.shippingAddress?.fullName?.split(' ')[0] || 'friend'}.
              A confirmation has been sent to {order.customer?.email}.
            </p>

            <div className="order-success__meta">
              <div>
                <span>Order number</span>
                <strong>{order.orderNumber}</strong>
              </div>
              <div>
                <span>Total paid</span>
                <strong>{formatPrice(order.total)}</strong>
              </div>
              <div>
                <span>Estimated delivery</span>
                <strong>2 – 4 business days</strong>
              </div>
            </div>

            <div className="order-success__actions">
              <Link to="/orders" className="btn btn--primary">
                <Package size={17} /> View my orders
              </Link>
              <Link to="/shop" className="btn btn--ghost">
                Continue shopping
              </Link>
              <Link to="/" className="btn btn--ghost">
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Checkout' }]} />
          <EmptyState
            icon={ShoppingBag}
            title="There is nothing to check out"
            description="Add a few pieces to your bag and come back when you are ready."
            action={{ label: 'Shop the collection', to: '/shop' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page checkout-page">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Checkout' }]} />

        <header className="page-header">
          <div>
            <span className="eyebrow">Secure checkout</span>
            <h1>Complete your order</h1>
            <p>Free express shipping and 30-day returns on every order over $100.</p>
          </div>
        </header>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={placeOrder} noValidate>
            {apiError && (
              <div className="form-banner" role="alert">
                <AlertCircle size={18} />
                <span>{apiError}</span>
              </div>
            )}

            <section className="form-section">
              <div className="form-section__head">
                <span>01</span>
                <div>
                  <h2>Contact details</h2>
                  <p>Where should we send your receipt and delivery updates?</p>
                </div>
              </div>
              <div className="form-grid">
                <label className={`field ${errors.fullName ? 'has-error' : ''}`}>
                  <span>Full name</span>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={update('fullName')}
                    placeholder="Alex Morgan"
                    autoComplete="name"
                  />
                  {errors.fullName && <em>{errors.fullName}</em>}
                </label>
                <label className={`field ${errors.email ? 'has-error' : ''}`}>
                  <span>Email address</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    placeholder="alex@example.com"
                    autoComplete="email"
                  />
                  {errors.email && <em>{errors.email}</em>}
                </label>
                <label className={`field field--full ${errors.phone ? 'has-error' : ''}`}>
                  <span>Phone number</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={update('phone')}
                    placeholder="+1 555 012 8899"
                    autoComplete="tel"
                  />
                  {errors.phone && <em>{errors.phone}</em>}
                </label>
              </div>
            </section>

            <section className="form-section">
              <div className="form-section__head">
                <span>02</span>
                <div>
                  <h2>Shipping address</h2>
                  <p>Express delivery, tracked from our door to yours.</p>
                </div>
              </div>
              <div className="form-grid">
                <label className={`field field--full ${errors.address ? 'has-error' : ''}`}>
                  <span>Street address</span>
                  <input
                    type="text"
                    value={form.address}
                    onChange={update('address')}
                    placeholder="24 Market Street, Apt 4B"
                    autoComplete="street-address"
                  />
                  {errors.address && <em>{errors.address}</em>}
                </label>
                <label className={`field ${errors.city ? 'has-error' : ''}`}>
                  <span>City</span>
                  <input
                    type="text"
                    value={form.city}
                    onChange={update('city')}
                    placeholder="San Francisco"
                    autoComplete="address-level2"
                  />
                  {errors.city && <em>{errors.city}</em>}
                </label>
                <label className={`field ${errors.postalCode ? 'has-error' : ''}`}>
                  <span>Postal code</span>
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={update('postalCode')}
                    placeholder="94103"
                    autoComplete="postal-code"
                  />
                  {errors.postalCode && <em>{errors.postalCode}</em>}
                </label>
                <label className={`field field--full ${errors.country ? 'has-error' : ''}`}>
                  <span>Country</span>
                  <select value={form.country} onChange={update('country')} autoComplete="country-name">
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.country && <em>{errors.country}</em>}
                </label>
              </div>
            </section>

            <section className="form-section">
              <div className="form-section__head">
                <span>03</span>
                <div>
                  <h2>Payment</h2>
                  <p>This is a demo checkout. No real payment is taken.</p>
                </div>
              </div>

              <div className="payment-options">
                <label className={`payment-option ${form.paymentMethod === 'card' ? 'is-active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={form.paymentMethod === 'card'}
                    onChange={update('paymentMethod')}
                  />
                  <CreditCard size={20} />
                  <div>
                    <strong>Credit or debit card</strong>
                    <span>Visa, Mastercard, Amex</span>
                  </div>
                </label>
                <label className={`payment-option ${form.paymentMethod === 'cod' ? 'is-active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={form.paymentMethod === 'cod'}
                    onChange={update('paymentMethod')}
                  />
                  <Wallet size={20} />
                  <div>
                    <strong>Cash on delivery</strong>
                    <span>Pay when your order arrives</span>
                  </div>
                </label>
              </div>

              {form.paymentMethod === 'card' && (
                <div className="form-grid card-grid">
                  <label className={`field field--full ${errors.cardNumber ? 'has-error' : ''}`}>
                    <span>Card number</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={form.cardNumber}
                      onChange={update('cardNumber')}
                      placeholder="4242 4242 4242 4242"
                      autoComplete="cc-number"
                    />
                    {errors.cardNumber && <em>{errors.cardNumber}</em>}
                  </label>
                  <label className={`field ${errors.expiry ? 'has-error' : ''}`}>
                    <span>Expiry</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={form.expiry}
                      onChange={update('expiry')}
                      placeholder="MM/YY"
                      autoComplete="cc-exp"
                    />
                    {errors.expiry && <em>{errors.expiry}</em>}
                  </label>
                  <label className={`field ${errors.cvc ? 'has-error' : ''}`}>
                    <span>CVC</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={form.cvc}
                      onChange={update('cvc')}
                      placeholder="123"
                      autoComplete="cc-csc"
                    />
                    {errors.cvc && <em>{errors.cvc}</em>}
                  </label>
                </div>
              )}
            </section>

            <div className="checkout-actions">
              <Link to="/cart" className="btn btn--ghost">
                <ArrowLeft size={16} /> Back to bag
              </Link>
              <button type="submit" className="btn btn--primary btn--lg" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner spinner--sm" /> Placing order...
                  </>
                ) : (
                  <>
                    <Lock size={17} /> Place order · {formatPrice(total)}
                  </>
                )}
              </button>
            </div>
          </form>

          <aside className="checkout-summary">
            <h2>Your order</h2>
            <span className="checkout-summary__count">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>

            <div className="checkout-items">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="checkout-item">
                  <img src={product.image} alt={product.name} />
                  <div>
                    <strong>{product.name}</strong>
                    <span>Qty {qty}</span>
                  </div>
                  <span>{formatPrice(product.price * qty)}</span>
                </div>
              ))}
            </div>

            <dl className="summary__rows">
              <div>
                <dt>Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div>
                <dt>Shipping</dt>
                <dd>{shipping === 0 ? <span className="free-tag">Free</span> : formatPrice(shipping)}</dd>
              </div>
              <div className="summary__total">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>

            <div className="checkout-trust">
              <span>
                <ShieldCheck size={15} /> Secure encrypted checkout
              </span>
              <span>
                <Truck size={15} /> Free express shipping over $100
              </span>
              <span>
                <ShoppingBag size={15} /> 30-day easy returns
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
