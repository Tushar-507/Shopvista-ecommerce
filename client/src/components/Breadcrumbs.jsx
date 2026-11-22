import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const last = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="breadcrumbs__item">
            {item.to && !last ? (
              <Link to={item.to}>{item.label}</Link>
            ) : (
              <span aria-current={last ? 'page' : undefined}>{item.label}</span>
            )}
            {!last && <ChevronRight size={13} aria-hidden="true" />}
          </span>
        );
      })}
    </nav>
  );
}
