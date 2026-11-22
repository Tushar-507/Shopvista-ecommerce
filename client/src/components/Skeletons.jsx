export function ProductCardSkeleton() {
  return (
    <div className="product-card product-card--skeleton" aria-hidden="true">
      <div className="skeleton skeleton--media" />
      <div className="product-card__body">
        <div className="skeleton skeleton--line skeleton--xs" />
        <div className="skeleton skeleton--line skeleton--md" />
        <div className="skeleton skeleton--line skeleton--sm" />
        <div className="skeleton skeleton--line skeleton--price" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="product-grid" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function PageLoader({ label = 'Loading' }) {
  return (
    <div className="page-loader" role="status">
      <span className="spinner" />
      <span>{label}</span>
    </div>
  );
}
