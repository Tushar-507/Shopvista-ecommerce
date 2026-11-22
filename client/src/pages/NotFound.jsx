import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="page">
      <div className="container">
        <div className="not-found">
          <span className="not-found__code">404</span>
          <span className="not-found__icon">
            <Compass size={26} />
          </span>
          <h1>This page took a wrong turn</h1>
          <p>
            The link may be outdated, or the page has moved. The collection, however, is exactly
            where you left it.
          </p>
          <div className="not-found__actions">
            <Link to="/" className="btn btn--primary">
              <ArrowLeft size={16} /> Back home
            </Link>
            <Link to="/shop" className="btn btn--ghost">
              Browse products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
