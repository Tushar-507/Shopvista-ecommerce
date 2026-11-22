import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Lock,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import EmptyState from '../components/EmptyState.jsx';
import QuantityStepper from '../components/QuantityStepper.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../utils/format.js';

export default function Cart() {
  const { user } = useAuth();
  const {
    items,
    count,
    subtotal,
    shipping,
    total,
    freeShippingRemaining,
    freeShippingThreshold,
    updateQty,
    removeFromCart,
    clearCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shopping bag' }]} />
          <EmptyState
            icon={ShoppingBag}
            title="Your bag is empty"
            description="Once you add something you love, it will show up here — saved and ready when you are."
            action={{ label: 'Start shopping', to: '/shop' }}
          />
        </div>
      </div>
    );
  }

  const progress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="page cart-page">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shopping bag' }]} />

        <header className="page-header page-header--row">
          <div>
            <span className="eyebrow">Almost yours</span>
            <h1>Your shopping bag</h1>
            <p>
              {count} {count === 1 ? 'item' : 'items'} ready to go. Free returns within 30 days.
            </p>
          </div>
          <button type="button" className="text-button" onClick={clearCart}>
            <Trash2 size={15} /> Clear bag
          </button>
        </header>

        <div className="cart-layout">
          <div className="cart-items">
            {items.map(({ product, qty }) => (
              <article key={product.id} className="cart-item">
                <Link to={`/product/${product.slug}`} className="cart-item__media">
                  <img src={product.image} alt={product.name} loading="lazy" />
                </Link>

                <div className="cart-item__info">
                  <span className="cart-item__category">{product.categoryName}</span>
                  <Link to={`/product/${product.slug}`} className="cart-item__name">
                    {product.name}
                  </Link>
                  <span className="cart-item__unit">{formatPrice(product.price)} each</span>

                  <div className="cart-item__controls">
                    <QuantityStepper
                      value={qty}
                      onChange={(value) => updateQty(product.id, value)}
                      min={1}
                      max={product.stock || 99}
                      size="sm"
                      label={`Quantity for ${product.name}`}
                    />
                    <button
                      type="button"
                      className="cart-item__remove"
                      onClick={() => removeFromCart(product.id)}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>

                <div className="cart-item__line">
                  <span>{formatPrice(product.price * qty)}</span>
                  {qty > 1 && <small>{formatPrice(product.price)} each</small>}
                </div>
              </article>
            ))}

            <div className="cart-benefits">
              <span>
                <Truck size={16} /> Free express shipping over $100
              </span>
              <span>
                <RotateCcw size={16} /> 30-day returns
              </span>
              <span>
                <ShieldCheck size={16} /> 2-year warranty
              </span>
            </div>
          </div>

          <aside className="summary">
            <h2>Order summary</h2>

            <div className="ship-progress">
              {freeShippingRemaining > 0 ? (
                <p>
                  You are <strong>{formatPrice(freeShippingRemaining)}</strong> away from free
                  express shipping.
                </p>
              ) : (
                <p className="ship-progress__done">
                  <ShieldCheck size={15} /> Free express shipping unlocked
                </p>
              )}
              <div className="progress">
                <span style={{ width: `${progress}%` }} />
              </div>
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

            <Link to="/checkout" className="btn btn--primary btn--lg btn--block">
              Proceed to checkout <ArrowRight size={18} />
            </Link>
            {!user && (
              <p className="summary__note">
                You&apos;ll create an account or sign in to complete your order.
              </p>
            )}
            <Link to="/shop" className="btn btn--ghost btn--block summary__continue">
              Continue shopping
            </Link>

            <p className="summary__secure">
              <Lock size={14} /> Encrypted, secure checkout. Taxes calculated at checkout.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
