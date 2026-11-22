import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import RatingStars from './RatingStars.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { discountPercent, formatPrice } from '../utils/format.js';

export default function ProductCard({ product, compact = false }) {
  const { addToCart } = useCart();
  const { isSaved, toggleWishlist } = useWishlist();
  const saved = isSaved(product.id);
  const discount = discountPercent(product);

  return (
    <article className={`product-card ${compact ? 'product-card--compact' : ''}`}>
      <div className="product-card__media">
        <Link to={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>
        {product.badge && <span className="product-card__badge">{product.badge}</span>}
        <button
          type="button"
          className={`wish-btn ${saved ? 'is-saved' : ''}`}
          onClick={() => toggleWishlist(product)}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={saved}
        >
          <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="product-card__body">
        <span className="product-card__category">{product.categoryName}</span>
        <h3 className="product-card__name">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <RatingStars value={product.rating} reviews={product.reviews} size={13} />

        <div className="product-card__footer">
          <div className="price">
            <span className="price__now">{formatPrice(product.price)}</span>
            {product.oldPrice > product.price && (
              <>
                <span className="price__old">{formatPrice(product.oldPrice)}</span>
                <span className="price__off">-{discount}%</span>
              </>
            )}
          </div>
          <button
            type="button"
            className="btn btn--primary btn--icon"
            onClick={() => addToCart(product, 1)}
            aria-label={`Add ${product.name} to bag`}
          >
            <ShoppingBag size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}
