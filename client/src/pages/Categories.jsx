import { Link } from 'react-router-dom';
import { ArrowUpRight, ShoppingBag } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import Reveal from '../components/Reveal.jsx';
import { categories, products } from '../data/products.js';

export default function Categories() {
  return (
    <div className="page">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Categories' }]} />

        <header className="page-header">
          <div>
            <span className="eyebrow">The edit</span>
            <h1>Shop by category</h1>
            <p>
              Seven collections, one standard. Every piece is chosen for design, durability and
              how it fits into your day.
            </p>
          </div>
        </header>

        <div className="category-grid category-grid--page">
          {categories.map((category, index) => {
            const count = products.filter((item) => item.category === category.slug).length;
            return (
              <Reveal key={category.slug} delay={index * 45}>
                <Link to={`/shop?category=${category.slug}`} className="category-card category-card--tall">
                  <img src={category.image} alt="" loading="lazy" />
                  <span className="category-card__overlay" />
                  <span className="category-card__content">
                    <span className="category-card__count">{count} products</span>
                    <strong>{category.name}</strong>
                    <span className="category-card__tagline">{category.tagline}</span>
                  </span>
                  <span className="category-card__arrow">
                    <ArrowUpRight size={17} />
                  </span>
                </Link>
              </Reveal>
            );
          })}

          <Reveal delay={320}>
            <Link to="/shop" className="category-card category-card--tall category-card--all">
              <span className="category-card__content">
                <span className="category-card__count">Everything in one place</span>
                <strong>Shop all products</strong>
                <span className="category-card__tagline">Browse the full collection</span>
              </span>
              <span className="category-card__arrow">
                <ShoppingBag size={18} />
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
