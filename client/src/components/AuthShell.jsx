import { Link } from 'react-router-dom';
import { ArrowLeft, Check, ShoppingBag } from 'lucide-react';
import { products } from '../data/products.js';

const points = [
  'Free express shipping over $100',
  '30-day easy returns, no questions',
  '2-year warranty on everything',
];

export default function AuthShell({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div className="auth-page">
      <div className="container auth-layout">
        <aside className="auth-aside">
          <img className="auth-aside__bg" src={products[0].image} alt="" aria-hidden="true" />
          <span className="auth-aside__overlay" aria-hidden="true" />
          <div className="auth-aside__content">
            <Link to="/" className="brand brand--light">
              <span className="brand__mark">
                <ShoppingBag size={19} strokeWidth={2.2} />
              </span>
              <span className="brand__text">
                Shop<span>Vista</span>
              </span>
            </Link>

            <div className="auth-aside__copy">
              <span className="eyebrow eyebrow--light">Members get more</span>
              <h2>Good design, delivered.</h2>
              <p>
                Join 25,000 people who shop a little smarter — early access to drops, private
                sales and a wishlist that travels with you.
              </p>
              <ul>
                {points.map((point) => (
                  <li key={point}>
                    <Check size={15} /> {point}
                  </li>
                ))}
              </ul>
              <blockquote>
                “The only store where I have liked everything I ordered. The details are
                genuinely considered.”
                <cite>— Maya R., verified customer</cite>
              </blockquote>
            </div>

            <Link to="/" className="auth-back">
              <ArrowLeft size={16} /> Back to the store
            </Link>
          </div>
        </aside>

        <div className="auth-main">
          <div className="auth-card">
            <span className="eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            {subtitle && <p className="auth-card__subtitle">{subtitle}</p>}
            {children}
            {footer && <div className="auth-card__footer">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
