import { Star } from 'lucide-react';

export default function RatingStars({ value = 0, reviews, size = 14, showValue = true }) {
  const rounded = Math.round(Number(value) || 0);

  return (
    <div className="rating" aria-label={`Rated ${value} out of 5`}>
      <span className="rating__stars" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={size}
            className={index < rounded ? 'is-filled' : 'is-empty'}
            strokeWidth={1.8}
          />
        ))}
      </span>
      {showValue && <span className="rating__value">{Number(value).toFixed(1)}</span>}
      {reviews !== undefined && <span className="rating__reviews">({reviews.toLocaleString()})</span>}
    </div>
  );
}
