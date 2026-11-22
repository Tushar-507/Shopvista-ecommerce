import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Headphones,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import RatingStars from '../components/RatingStars.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { categories, products } from '../data/products.js';
import { discountPercent, formatPrice } from '../utils/format.js';

const heroProduct = products.find((item) => item.id === 'aurora-anc-headphones');
const featured = products.filter((item) => item.featured).slice(0, 8);
const bestSellers = products.filter((item) => item.bestseller).slice(0, 4);

const benefits = [
  {
    icon: Truck,
    title: 'Free express shipping',
    text: 'Complimentary next-day delivery on every order over $100, tracked door to door.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure payments',
    text: 'Encrypted checkout with support for all major cards and wallets.',
  },
  {
    icon: RotateCcw,
    title: 'Easy 30-day returns',
    text: 'Changed your mind? Send it back within 30 days, no questions asked.',
  },
  {
    icon: Headphones,
    title: 'Real human support',
    text: 'A product specialist on hand 24/7, before and after you buy.',
  },
];

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero__glow hero__glow--one" aria-hidden="true" />
        <div className="hero__glow hero__glow--two" aria-hidden="true" />
        <div className="container hero__inner">
          <div className="hero__copy">
            <span className="eyebrow eyebrow--pill">
              <Sparkles size={14} /> New season drop · up to 40% off
            </span>
            <h1>
              Tech that feels
              <span className="text-gradient"> effortlessly premium.</span>
            </h1>
            <p className="hero__lead">
              Discover a curated collection of audio, wearables and everyday essentials — chosen
              for exceptional design, honest pricing and the way they make your day better.
            </p>
            <div className="hero__actions">
              <Link to="/shop" className="btn btn--primary btn--lg">
                Shop now <ArrowRight size={18} />
              </Link>
              <Link to="/categories" className="btn btn--ghost btn--lg">
                Browse categories
              </Link>
            </div>
            <div className="hero__stats">
              <div>
                <strong>25k+</strong>
                <span>Happy customers</span>
              </div>
              <div>
                <strong>4.9/5</strong>
                <span>Average rating</span>
              </div>
              <div>
                <strong>30 days</strong>
                <span>Easy returns</span>
              </div>
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__card">
              <div className="hero__card-glow" aria-hidden="true" />
              <img src={heroProduct.image} alt={heroProduct.name} />
              <span className="hero__label">Editor&apos;s pick</span>
            </div>

            <div className="hero__float hero__float--rating">
              <span className="hero__float-icon">
                <Star size={16} fill="currentColor" />
              </span>
              <div>
                <strong>4.8 / 5</strong>
                <span>1,240 reviews</span>
              </div>
            </div>

            <Link to={`/product/${heroProduct.slug}`} className="hero__float hero__float--product">
              <div>
                <span>Featured</span>
                <strong>{heroProduct.name}</strong>
              </div>
              <span className="hero__float-price">{formatPrice(heroProduct.price)}</span>
              <span className="hero__float-arrow">
                <ArrowUpRight size={16} />
              </span>
            </Link>

            <div className="hero__float hero__float--shipping">
              <Truck size={16} />
              <span>Free express shipping</span>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="hero__strip">
            <span>
              <BadgeCheck size={16} /> 2-year warranty on every product
            </span>
            <span>
              <ShieldCheck size={16} /> Secure, encrypted checkout
            </span>
            <span>
              <RotateCcw size={16} /> 30-day no-questions returns
            </span>
            <span>
              <Truck size={16} /> Free shipping over $100
            </span>
          </div>
        </div>
      </section>

      <section className="section" id="categories">
        <div className="container">
          <SectionHeading
            eyebrow="Browse the edit"
            title="Shop by category"
            description="Seven considered collections, one consistent standard of quality."
            action={
              <Link to="/categories" className="text-link">
                All categories <ArrowRight size={16} />
              </Link>
            }
          />
          <div className="category-grid">
            {categories.map((category, index) => (
              <Reveal key={category.slug} delay={index * 45}>
                <Link to={`/shop?category=${category.slug}`} className="category-card">
                  <img src={category.image} alt="" loading="lazy" />
                  <span className="category-card__overlay" />
                  <span className="category-card__content">
                    <span className="category-card__count">
                      {products.filter((item) => item.category === category.slug).length} products
                    </span>
                    <strong>{category.name}</strong>
                    <span className="category-card__tagline">{category.tagline}</span>
                  </span>
                  <span className="category-card__arrow">
                    <ArrowUpRight size={17} />
                  </span>
                </Link>
              </Reveal>
            ))}
            <Reveal delay={315}>
              <Link to="/shop" className="category-card category-card--all">
                <span className="category-card__content">
                  <span className="category-card__count">Everything in one place</span>
                  <strong>Shop all products</strong>
                  <span className="category-card__tagline">Browse the full collection</span>
                </span>
                <span className="category-card__arrow">
                  <ShoppingBag size={17} />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <SectionHeading
            eyebrow="Hand-picked"
            title="Featured this week"
            description="The pieces our team keeps coming back to."
            action={
              <Link to="/shop" className="text-link">
                Shop all <ArrowRight size={16} />
              </Link>
            }
          />
          <div className="product-grid">
            {featured.map((product, index) => (
              <Reveal key={product.id} delay={index * 35}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="promo">
            <div className="promo__glow" aria-hidden="true" />
            <div className="promo__copy">
              <span className="eyebrow eyebrow--light">
                <Sparkles size={14} /> Mid-season sale
              </span>
              <h2>
                Up to <span>40% off</span> premium audio.
              </h2>
              <p>
                Headphones, earbuds and speakers built for deep focus and long nights — now at
                their best price of the season.
              </p>
              <div className="promo__actions">
                <Link to="/shop?sale=1" className="btn btn--light btn--lg">
                  Shop the sale <ArrowRight size={18} />
                </Link>
                <span className="promo__code">
                  Use code <strong>SHOPVISTA40</strong>
                </span>
              </div>
            </div>
            <div className="promo__visual">
              <img src={products[0].image} alt="" loading="lazy" />
              <div className="promo__tag">
                <span>Save</span>
                <strong>{discountPercent(products[0])}%</strong>
              </div>
              <div className="promo__rating">
                <RatingStars value={4.8} reviews={1240} size={13} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <SectionHeading
            eyebrow="Loved by thousands"
            title="Best sellers"
            description="The products that keep selling out — for good reason."
            action={
              <Link to="/shop?sort=popularity" className="text-link">
                View ranking <ArrowRight size={16} />
              </Link>
            }
          />
          <div className="bestseller-grid">
            {bestSellers.map((product, index) => (
              <Reveal key={product.id} delay={index * 50}>
                <Link to={`/product/${product.slug}`} className="bestseller">
                  <span className="bestseller__rank">{String(index + 1).padStart(2, '0')}</span>
                  <img src={product.image} alt={product.name} loading="lazy" />
                  <div className="bestseller__body">
                    <span className="bestseller__category">{product.categoryName}</span>
                    <strong>{product.name}</strong>
                    <RatingStars value={product.rating} reviews={product.reviews} size={12} />
                    <div className="bestseller__price">
                      {formatPrice(product.price)}
                      {product.oldPrice > product.price && (
                        <span>{formatPrice(product.oldPrice)}</span>
                      )}
                    </div>
                  </div>
                  <span className="bestseller__arrow">
                    <ArrowUpRight size={18} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="about">
        <div className="container">
          <SectionHeading
            eyebrow="Why ShopVista"
            title="A better way to buy"
            description="Premium products deserve a premium experience, from first click to final delivery."
            align="center"
          />
          <div className="benefits">
            {benefits.map(({ icon: Icon, title, text }, index) => (
              <Reveal key={title} delay={index * 60}>
                <div className="benefit-card">
                  <span className="benefit-card__icon">
                    <Icon size={22} />
                  </span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
