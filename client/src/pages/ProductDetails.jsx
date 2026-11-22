import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  Check,
  Heart,
  Minus,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Zap,
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import ProductCard from '../components/ProductCard.jsx';
import QuantityStepper from '../components/QuantityStepper.jsx';
import RatingStars from '../components/RatingStars.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { fetchProduct } from '../services/api.js';
import { discountPercent, formatPrice } from '../utils/format.js';

function DetailSkeleton() {
  return (
    <div className="product-detail" aria-busy="true">
      <div>
        <div className="skeleton skeleton--hero" />
        <div className="gallery-thumbs">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="skeleton skeleton--thumb" />
          ))}
        </div>
      </div>
      <div>
        <div className="skeleton skeleton--line skeleton--xs" />
        <div className="skeleton skeleton--line skeleton--title" />
        <div className="skeleton skeleton--line skeleton--sm" />
        <div className="skeleton skeleton--line skeleton--price" />
        <div className="skeleton skeleton--line skeleton--md" />
        <div className="skeleton skeleton--line skeleton--md" />
        <div className="skeleton skeleton--line skeleton--sm" />
        <div className="skeleton skeleton--button" />
      </div>
    </div>
  );
}

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const { isSaved, toggleWishlist } = useWishlist();

  const [state, setState] = useState({ loading: true, product: null, related: [], error: null });
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const data = await fetchProduct(slug);
      setState({ loading: false, product: data.product, related: data.related, error: null });
    } catch (error) {
      setState({ loading: false, product: null, related: [], error });
    }
  }, [slug]);

  useEffect(() => {
    setActiveImage(0);
    setQuantity(1);
    load();
  }, [load]);

  const { product, related, loading, error } = state;

  const buyNow = () => {
    if (!user) {
      toast('Create an account to buy this item.', 'info');
      navigate('/signup', {
        state: {
          from: { pathname: '/checkout' },
          reason: 'purchase',
          buyNow: { product, qty: quantity },
        },
      });
      return;
    }
    addToCart(product, quantity);
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }, { label: 'Loading' }]} />
          <DetailSkeleton />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }, { label: 'Not found' }]} />
          <div className="error-panel error-panel--center">
            <AlertCircle size={24} />
            <div>
              <strong>{error?.message || 'We could not find that product.'}</strong>
              <p>It may have sold out or moved. Explore the rest of the collection instead.</p>
            </div>
            <div className="error-panel__actions">
              <button type="button" className="btn btn--ghost" onClick={load}>
                <RefreshCw size={16} /> Try again
              </button>
              <Link to="/shop" className="btn btn--primary">
                Back to shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const saved = isSaved(product.id);
  const discount = discountPercent(product);
  const saving = product.oldPrice > product.price ? product.oldPrice - product.price : 0;

  return (
    <div className="page product-page">
      <div className="container">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Shop', to: '/shop' },
            { label: product.categoryName, to: `/shop?category=${product.category}` },
            { label: product.name },
          ]}
        />

        <div className="product-detail">
          <div className="product-gallery">
            <div className="product-gallery__main">
              <img src={product.images[activeImage]} alt={product.name} />
              {product.badge && <span className="product-card__badge">{product.badge}</span>}
              {discount > 0 && <span className="product-gallery__discount">-{discount}%</span>}
            </div>
            <div className="gallery-thumbs">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  className={`gallery-thumb ${activeImage === index ? 'is-active' : ''}`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`View image ${index + 1} of ${product.name}`}
                >
                  <img src={image} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          <div className="product-info">
            <div className="product-info__top">
              <Link to={`/shop?category=${product.category}`} className="product-info__category">
                {product.categoryName}
              </Link>
              {product.stock > 0 ? (
                <span className="stock-pill">
                  <Check size={13} /> In stock
                </span>
              ) : (
                <span className="stock-pill stock-pill--out">Sold out</span>
              )}
            </div>

            <h1>{product.name}</h1>

            <div className="product-info__meta">
              <RatingStars value={product.rating} reviews={product.reviews} size={15} />
              <span className="meta-divider" />
              <span className="product-info__sku">SKU {product.id.slice(0, 8).toUpperCase()}</span>
            </div>

            <div className="product-info__price">
              <span className="price__now price__now--lg">{formatPrice(product.price)}</span>
              {product.oldPrice > product.price && (
                <span className="price__old price__old--lg">{formatPrice(product.oldPrice)}</span>
              )}
              {saving > 0 && (
                <span className="save-pill">Save {formatPrice(saving)}</span>
              )}
            </div>

            <p className="product-info__desc">{product.description}</p>

            <div className="product-info__highlights">
              <span>
                <Zap size={15} /> Ships within 24 hours
              </span>
              <span>
                <ShieldCheck size={15} /> 2-year warranty
              </span>
            </div>

            <div className="product-info__buy">
              <div className="product-info__qty">
                <span className="field-label">Quantity</span>
                <QuantityStepper
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={Math.max(1, product.stock)}
                />
                {product.stock <= 15 && (
                  <span className="stock-note">Only {product.stock} left</span>
                )}
              </div>

              <div className="product-info__actions">
                <button
                  type="button"
                  className="btn btn--primary btn--lg"
                  onClick={() => addToCart(product, quantity)}
                  disabled={product.stock === 0}
                >
                  <ShoppingBag size={18} /> Add to bag
                </button>
                <button
                  type="button"
                  className="btn btn--light btn--lg"
                  onClick={buyNow}
                  disabled={product.stock === 0}
                >
                  Buy now
                </button>
                <button
                  type="button"
                  className={`btn btn--icon-lg ${saved ? 'is-saved' : ''}`}
                  onClick={() => toggleWishlist(product)}
                  aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
                  aria-pressed={saved}
                >
                  <Heart size={20} fill={saved ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            <div className="product-perks">
              <span>
                <Truck size={17} /> Free express shipping over $100
              </span>
              <span>
                <RotateCcw size={17} /> 30-day easy returns
              </span>
              <span>
                <ShieldCheck size={17} /> Secure encrypted checkout
              </span>
            </div>
          </div>
        </div>

        <div className="product-extra">
          <section className="info-panel">
            <h2>Details &amp; specifications</h2>
            <p>{product.description}</p>
            <dl className="spec-list">
              {product.specs.map((spec) => (
                <div key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
              <div>
                <dt>Category</dt>
                <dd>{product.categoryName}</dd>
              </div>
            </dl>
          </section>

          <section className="info-panel">
            <h2>Delivery &amp; returns</h2>
            <ul className="perk-list">
              <li>
                <span>
                  <Truck size={17} />
                </span>
                <div>
                  <strong>Free express shipping</strong>
                  <p>Next-day delivery on orders over $100, tracked from our door to yours.</p>
                </div>
              </li>
              <li>
                <span>
                  <RotateCcw size={17} />
                </span>
                <div>
                  <strong>30-day returns</strong>
                  <p>Not the right fit? Return it within 30 days for a full refund.</p>
                </div>
              </li>
              <li>
                <span>
                  <ShieldCheck size={17} />
                </span>
                <div>
                  <strong>2-year warranty</strong>
                  <p>Every product is covered against manufacturing defects for two years.</p>
                </div>
              </li>
            </ul>
            <div className="info-panel__note">
              <Minus size={14} /> Questions? Our product specialists are available 24/7.
            </div>
          </section>
        </div>

        {related.length > 0 && (
          <section className="section section--tight related">
            <SectionHeading
              eyebrow="Complete the set"
              title="You may also like"
              action={
                <Link to={`/shop?category=${product.category}`} className="text-link">
                  More in {product.categoryName}
                </Link>
              }
            />
            <div className="product-grid">
              {related.map((item, index) => (
                <Reveal key={item.id} delay={index * 40}>
                  <ProductCard product={item} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
