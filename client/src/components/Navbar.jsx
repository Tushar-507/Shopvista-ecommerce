import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Heart,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingBag,
  Sparkles,
  User,
  X,
  Phone,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Categories', to: '/categories' },
  { label: 'About', to: '/#about' },
  { label: 'Contact', to: '/#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [term, setTerm] = useState('');
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', mobileOpen);
    return () => document.body.classList.remove('no-scroll');
  }, [mobileOpen]);

  useEffect(() => {
    const onClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const submitSearch = (event) => {
    event.preventDefault();
    const query = term.trim();
    navigate(query ? `/shop?search=${encodeURIComponent(query)}` : '/shop');
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <>
      <div className="announce">
        <div className="container announce__inner">
          <span className="announce__item">
            <Sparkles size={14} /> Free express shipping on orders over $100
          </span>
          <span className="announce__item announce__item--muted">
            <Phone size={14} /> 24/7 support · 30-day easy returns
          </span>
        </div>
      </div>

      <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container navbar__inner">
          <Link to="/" className="brand" aria-label="ShopVista home">
            <span className="brand__mark">
              <ShoppingBag size={19} strokeWidth={2.2} />
            </span>
            <span className="brand__text">
              Shop<span>Vista</span>
            </span>
          </Link>

          <nav className="nav-links" aria-label="Primary">
            {links.map((link) =>
              link.to.includes('#') ? (
                <Link key={link.label} to={link.to} className="nav-link">
                  {link.label}
                </Link>
              ) : (
                <NavLink
                  key={link.label}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
                >
                  {link.label}
                </NavLink>
              ),
            )}
          </nav>

          <form className="nav-search" onSubmit={submitSearch} role="search">
            <Search size={17} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search products..."
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              aria-label="Search products"
            />
          </form>

          <div className="nav-actions">
            <Link
              to="/wishlist"
              className="icon-btn"
              aria-label={
                wishlistCount > 0
                  ? `Wishlist, ${wishlistCount} ${wishlistCount === 1 ? 'item' : 'items'}`
                  : 'Wishlist'
              }
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="icon-badge" aria-hidden="true">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="profile" ref={profileRef}>
                <button
                  type="button"
                  className="profile__trigger"
                  onClick={() => setProfileOpen((open) => !open)}
                  aria-expanded={profileOpen}
                  aria-label="Account menu"
                >
                  <span className="avatar">{user.name?.charAt(0)?.toUpperCase() || 'S'}</span>
                  <ChevronDown size={15} className="profile__chevron" />
                </button>
                {profileOpen && (
                  <div className="profile__menu">
                    <div className="profile__header">
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                    <Link to="/orders" className="profile__item">
                      <Package size={16} /> My orders
                    </Link>
                    <Link to="/wishlist" className="profile__item">
                      <Heart size={16} /> My wishlist
                    </Link>
                    <button type="button" className="profile__item" onClick={handleLogout}>
                      <LogOut size={16} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="icon-btn" aria-label="Sign in">
                <User size={20} />
              </Link>
            )}

            <Link
              to="/cart"
              className="icon-btn icon-btn--cart"
              aria-label={
                cartCount > 0
                  ? `Shopping bag, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`
                  : 'Shopping bag'
              }
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="icon-badge icon-badge--cart" aria-hidden="true">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              className="icon-btn nav-toggle"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <div className={`mobile-nav ${mobileOpen ? 'is-open' : ''}`}>
          <form className="mobile-nav__search" onSubmit={submitSearch} role="search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search products..."
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              aria-label="Search products"
            />
          </form>
          <nav className="mobile-nav__links" aria-label="Mobile">
            {links.map((link) => (
              <Link key={link.label} to={link.to} className="mobile-nav__link">
                {link.label}
              </Link>
            ))}
            {user && (
              <>
                <Link to="/orders" className="mobile-nav__link">
                  My orders
                </Link>
                <Link to="/wishlist" className="mobile-nav__link">
                  My wishlist
                </Link>
              </>
            )}
          </nav>
          <div className="mobile-nav__auth">
            {user ? (
              <button type="button" className="btn btn--ghost btn--block" onClick={handleLogout}>
                <LogOut size={17} /> Sign out
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn--primary btn--block">
                  Sign in
                </Link>
                <Link to="/signup" className="btn btn--ghost btn--block">
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      {mobileOpen && (
        <button
          type="button"
          className="mobile-backdrop"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
