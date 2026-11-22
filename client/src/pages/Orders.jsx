import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  CalendarDays,
  CreditCard,
  MapPin,
  Package,
  RefreshCw,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { PageLoader } from '../components/Skeletons.jsx';
import { fetchMyOrders } from '../services/api.js';
import { formatPrice } from '../utils/format.js';

const statusStyles = {
  processing: { label: 'Processing', tone: 'processing' },
  shipped: { label: 'Shipped', tone: 'shipped' },
  delivered: { label: 'Delivered', tone: 'delivered' },
  cancelled: { label: 'Cancelled', tone: 'cancelled' },
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Recently placed' : dateFormatter.format(date);
};

export default function Orders() {
  const [state, setState] = useState({ loading: true, orders: [], error: null });

  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const data = await fetchMyOrders();
      setState({ loading: false, orders: data.orders ?? [], error: null });
    } catch (error) {
      setState({ loading: false, orders: [], error });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const { loading, orders, error } = state;

  return (
    <div className="page orders-page">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'My orders' }]} />

        <header className="page-header page-header--row">
          <div>
            <span className="eyebrow">Order history</span>
            <h1>My orders</h1>
            <p>
              {orders.length > 0
                ? `${orders.length} ${orders.length === 1 ? 'order' : 'orders'} placed with ShopVista.`
                : 'Every order you place will be listed here with its items, status and total.'}
            </p>
          </div>
          <Link to="/shop" className="btn btn--ghost">
            <ShoppingBag size={16} /> Continue shopping
          </Link>
        </header>

        {loading ? (
          <PageLoader label="Loading your orders..." />
        ) : error ? (
          <div className="error-panel error-panel--center">
            <AlertCircle size={24} />
            <div>
              <strong>We could not load your orders.</strong>
              <p>
                {error.status === 0
                  ? 'The ShopVista API is offline. Start the server, then try again.'
                  : error.message || 'Please try again in a moment.'}
              </p>
            </div>
            <div className="error-panel__actions">
              <button type="button" className="btn btn--ghost" onClick={load}>
                <RefreshCw size={16} /> Try again
              </button>
              <Link to="/shop" className="btn btn--primary">
                Browse products
              </Link>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="When you place an order it will appear here, ready to track and reorder."
            action={{ label: 'Start shopping', to: '/shop' }}
          />
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
                const status = statusStyles[order.status] ?? statusStyles.processing;
                const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);

                return (
                  <article key={order.id} className="order-card">
                    <header className="order-card__head">
                      <div>
                        <span className="order-card__label">Order number</span>
                        <strong>{order.orderNumber}</strong>
                        <span className="order-card__date">
                          <CalendarDays size={14} />
                          Placed {formatDate(order.createdAt)}
                        </span>
                      </div>
                      <span className={`status-pill status-pill--${status.tone}`}>{status.label}</span>
                    </header>

                    <div className="order-card__body">
                      <div className="order-card__items">
                        {order.items.map((item) => (
                          <div key={`${order.id}-${item.productId}`} className="order-line">
                            <img src={item.image} alt="" loading="lazy" />
                            <div>
                              <Link to={`/product/${item.productId}`}>{item.name}</Link>
                              <span>
                                Qty {item.qty} · {formatPrice(item.price)} each
                              </span>
                            </div>
                            <strong>{formatPrice(item.price * item.qty)}</strong>
                          </div>
                        ))}
                      </div>

                      <aside className="order-card__summary">
                        <dl className="summary__rows">
                          <div>
                            <dt>Subtotal</dt>
                            <dd>{formatPrice(order.subtotal)}</dd>
                          </div>
                          <div>
                            <dt>Shipping</dt>
                            <dd>
                              {order.shipping === 0 ? (
                                <span className="free-tag">Free</span>
                              ) : (
                                formatPrice(order.shipping)
                              )}
                            </dd>
                          </div>
                          <div className="summary__total">
                            <dt>Total</dt>
                            <dd>{formatPrice(order.total)}</dd>
                          </div>
                        </dl>

                        <div className="order-card__meta">
                          <span>
                            <CreditCard size={14} /> {order.paymentMethod}
                          </span>
                          <span>
                            <Truck size={14} />
                            {order.status === 'delivered'
                              ? 'Delivered'
                              : 'Arriving in 2 – 4 business days'}
                          </span>
                          <span>
                            <Package size={14} />
                            {itemCount} {itemCount === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </aside>
                    </div>

                    <footer className="order-card__foot">
                      <span>
                        <MapPin size={14} />
                        {order.shippingAddress.fullName} · {order.shippingAddress.address},{' '}
                        {order.shippingAddress.city} {order.shippingAddress.postalCode}
                      </span>
                      <Link to="/shop" className="text-link">
                        Shop again
                      </Link>
                    </footer>
                  </article>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
