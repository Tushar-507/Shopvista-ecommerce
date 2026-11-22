import { Link } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({ icon: Icon = PackageOpen, title, description, action }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">
        <Icon size={30} />
      </span>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action?.label &&
        (action.to ? (
          <Link to={action.to} className="btn btn--primary">
            {action.label}
          </Link>
        ) : (
          <button type="button" className="btn btn--primary" onClick={action.onClick}>
            {action.label}
          </button>
        ))}
    </div>
  );
}
