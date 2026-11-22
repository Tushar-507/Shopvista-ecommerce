import { Heart } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

export default function Wishlist() {
  const { items } = useWishlist();

  return (
    <div className="page">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />

        <header className="page-header">
          <div>
            <span className="eyebrow">Saved for later</span>
            <h1>Your wishlist</h1>
            <p>
              {items.length === 0
                ? 'Everything you save will live here, ready when the moment is right.'
                : `${items.length} ${items.length === 1 ? 'piece' : 'pieces'} you are keeping an eye on.`}
            </p>
          </div>
        </header>

        {items.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Nothing saved yet"
            description="Tap the heart on any product to keep it here while you decide."
            action={{ label: 'Explore products', to: '/shop' }}
          />
        ) : (
          <div className="product-grid">
            {items.map((product, index) => (
              <Reveal key={product.id} delay={index * 35}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
