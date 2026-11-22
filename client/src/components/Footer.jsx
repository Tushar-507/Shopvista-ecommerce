import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  Twitter,
  Youtube,
} from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'All products', to: '/shop' },
      { label: 'New arrivals', to: '/shop?sort=popularity' },
      { label: 'Best sellers', to: '/shop?sort=rating' },
      { label: 'Sale', to: '/shop?sale=1' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', to: '/#about' },
      { label: 'Careers', to: '/#contact' },
      { label: 'Press', to: '/#contact' },
      { label: 'Sustainability', to: '/#about' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact us', to: '/#contact' },
      { label: 'Shipping & returns', to: '/#about' },
      { label: 'Track your order', to: '/#contact' },
      { label: 'FAQs', to: '/#contact' },
    ],
  },
];

const socials = [
  { label: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
  { label: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
  { label: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
  { label: 'YouTube', icon: Youtube, href: 'https://youtube.com' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const subscribe = (event) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast('Please enter a valid email address.', 'error');
      return;
    }
    toast('You are on the list. Welcome to ShopVista.', 'success');
    setEmail('');
  };

  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="brand">
              <span className="brand__mark">
                <ShoppingBag size={19} strokeWidth={2.2} />
              </span>
              <span className="brand__text">
                Shop<span>Vista</span>
              </span>
            </Link>
            <p>
              Curated tech and lifestyle essentials, chosen for how they look, how they feel and
              how long they last.
            </p>
            <div className="footer__socials">
              {socials.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  className="social-btn"
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <div className="footer__links">
            {columns.map((column) => (
              <div key={column.title} className="footer__column">
                <h4>{column.title}</h4>
                {column.links.map((link) => (
                  <Link key={link.label} to={link.to}>
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>

          <div className="footer__newsletter">
            <h4>Join the list</h4>
            <p>Early access to drops, private sales and a little inspiration. No noise.</p>
            <form onSubmit={subscribe} className="newsletter">
              <Mail size={17} aria-hidden="true" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
              />
              <button type="submit" aria-label="Subscribe">
                <ArrowRight size={17} />
              </button>
            </form>
            <div className="footer__contact">
              <span>
                <Phone size={14} /> +1 (555) 012-8899
              </span>
              <span>
                <MapPin size={14} /> 24 Market Street, San Francisco
              </span>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} ShopVista. All rights reserved.</span>
          <div className="footer__policies">
            <Link to="/#contact">Privacy</Link>
            <Link to="/#contact">Terms</Link>
            <Link to="/#contact">Cookies</Link>
          </div>
          <div className="payment-badges" aria-label="Accepted payments">
            <span>VISA</span>
            <span>MC</span>
            <span>AMEX</span>
            <span>PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
