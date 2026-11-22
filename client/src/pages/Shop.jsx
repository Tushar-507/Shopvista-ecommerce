import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Search,
  SlidersHorizontal,
  WifiOff,
  X,
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { ProductGridSkeleton } from '../components/Skeletons.jsx';
import { categories, priceBounds, products as catalog } from '../data/products.js';
import { fetchProducts } from '../services/api.js';
import { formatPrice } from '../utils/format.js';

const DEFAULT_RANGE = { min: priceBounds.min, max: priceBounds.max };
const PAGE_SIZE = 9;

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Top rated' },
];

const quickRanges = [
  { label: 'Under $100', min: priceBounds.min, max: 100 },
  { label: '$100 – $300', min: 100, max: 300 },
  { label: '$300 – $700', min: 300, max: 700 },
  { label: '$700+', min: 700, max: priceBounds.max },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sale = searchParams.get('sale') === '1';
  const sort = searchParams.get('sort') || 'featured';

  const [term, setTerm] = useState(search);
  const [priceRange, setPriceRange] = useState(DEFAULT_RANGE);
  const [appliedRange, setAppliedRange] = useState(DEFAULT_RANGE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [state, setState] = useState({
    loading: true,
    products: [],
    total: 0,
    source: 'api',
    error: null,
  });

  const setParam = useCallback(
    (key, value) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          if (value) next.set(key, value);
          else next.delete(key);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  useEffect(() => {
    setTerm(search);
  }, [search]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (term.trim() !== search) setParam('search', term.trim());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [term, search, setParam]);

  useEffect(() => {
    const timer = window.setTimeout(() => setAppliedRange(priceRange), 250);
    return () => window.clearTimeout(timer);
  }, [priceRange]);

  const priceActive =
    appliedRange.min > priceBounds.min || appliedRange.max < priceBounds.max;

  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const data = await fetchProducts({
        search,
        category,
        sale: sale ? 1 : '',
        sort,
        minPrice: priceActive ? appliedRange.min : '',
        maxPrice: priceActive ? appliedRange.max : '',
      });
      setState({
        loading: false,
        products: data.products,
        total: data.total,
        source: data.source,
        error: data.error ?? null,
      });
    } catch (error) {
      setState({
        loading: false,
        products: [],
        total: 0,
        source: 'local',
        error,
      });
    }
  }, [search, category, sale, sort, priceActive, appliedRange.min, appliedRange.max]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [search, category, sale, sort, appliedRange.min, appliedRange.max]);

  const clearAll = () => {
    setTerm('');
    setPriceRange(DEFAULT_RANGE);
    setAppliedRange(DEFAULT_RANGE);
    setSearchParams({}, { replace: true });
  };

  const activeFilters = useMemo(() => {
    const filters = [];
    if (search) filters.push({ key: 'search', label: `Search: “${search}”` });
    if (category) {
      const name = categories.find((item) => item.slug === category)?.name ?? category;
      filters.push({ key: 'category', label: name });
    }
    if (sale) filters.push({ key: 'sale', label: 'On sale' });
    if (priceActive) {
      filters.push({
        key: 'price',
        label: `${formatPrice(appliedRange.min)} – ${formatPrice(appliedRange.max)}`,
      });
    }
    return filters;
  }, [search, category, sale, priceActive, appliedRange]);

  const removeFilter = (key) => {
    if (key === 'price') {
      setPriceRange(DEFAULT_RANGE);
      setAppliedRange(DEFAULT_RANGE);
      return;
    }
    if (key === 'search') setTerm('');
    setParam(key, '');
  };

  const results = state.products;
  const shown = results.slice(0, visible);

  return (
    <div className="page shop-page">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shop' }]} />

        <header className="page-header">
          <div>
            <span className="eyebrow">The collection</span>
            <h1>All products</h1>
            <p>
              {state.total > 0
                ? `${state.total} considered pieces across audio, tech and everyday living.`
                : 'A considered collection of premium tech and lifestyle essentials.'}
            </p>
          </div>
        </header>

        <div className="shop-layout">
          <aside className={`filters ${filtersOpen ? 'is-open' : ''}`} aria-label="Product filters">
            <div className="filters__head">
              <h2>Filters</h2>
              <button
                type="button"
                className="icon-btn filters__close"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>

            <div className="filter-group">
              <h3>Category</h3>
              <button
                type="button"
                className={`filter-option ${!category ? 'is-active' : ''}`}
                onClick={() => setParam('category', '')}
              >
                <span>All products</span>
                <span className="filter-option__count">{catalog.length}</span>
              </button>
              {categories.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  className={`filter-option ${category === item.slug ? 'is-active' : ''}`}
                  onClick={() => setParam('category', category === item.slug ? '' : item.slug)}
                >
                  <span>{item.name}</span>
                  <span className="filter-option__count">
                    {catalog.filter((product) => product.category === item.slug).length}
                  </span>
                </button>
              ))}
            </div>

            <div className="filter-group">
              <h3>Price range</h3>
              <div className="price-values">
                <span>{formatPrice(priceRange.min)}</span>
                <span>{formatPrice(priceRange.max)}</span>
              </div>
              <label className="range">
                <span>Minimum</span>
                <input
                  type="range"
                  min={priceBounds.min}
                  max={priceBounds.max}
                  step={10}
                  value={priceRange.min}
                  onChange={(event) =>
                    setPriceRange((current) => ({
                      ...current,
                      min: Math.min(Number(event.target.value), current.max - 10),
                    }))
                  }
                />
              </label>
              <label className="range">
                <span>Maximum</span>
                <input
                  type="range"
                  min={priceBounds.min}
                  max={priceBounds.max}
                  step={10}
                  value={priceRange.max}
                  onChange={(event) =>
                    setPriceRange((current) => ({
                      ...current,
                      max: Math.max(Number(event.target.value), current.min + 10),
                    }))
                  }
                />
              </label>
              <div className="price-chips">
                {quickRanges.map((range) => {
                  const active =
                    priceRange.min === range.min && priceRange.max === range.max;
                  return (
                    <button
                      key={range.label}
                      type="button"
                      className={`chip ${active ? 'is-active' : ''}`}
                      onClick={() => setPriceRange({ min: range.min, max: range.max })}
                    >
                      {range.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="filter-group">
              <h3>Offers</h3>
              <label className="filter-check">
                <input
                  type="checkbox"
                  checked={sale}
                  onChange={(event) => setParam('sale', event.target.checked ? '1' : '')}
                />
                <span>On sale only</span>
              </label>
            </div>

            <button type="button" className="btn btn--ghost btn--block" onClick={clearAll}>
              Clear all filters
            </button>
          </aside>

          <div className="shop-results">
            <div className="shop-toolbar">
              <div className="shop-search">
                <Search size={17} aria-hidden="true" />
                <input
                  type="search"
                  value={term}
                  onChange={(event) => setTerm(event.target.value)}
                  placeholder="Search the collection..."
                  aria-label="Search the collection"
                />
                {term && (
                  <button
                    type="button"
                    onClick={() => setTerm('')}
                    aria-label="Clear search"
                    className="shop-search__clear"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <div className="shop-toolbar__actions">
                <button
                  type="button"
                  className="btn btn--ghost filter-toggle"
                  onClick={() => setFiltersOpen(true)}
                >
                  <SlidersHorizontal size={16} /> Filters
                  {activeFilters.length > 0 && (
                    <span className="filter-toggle__count">{activeFilters.length}</span>
                  )}
                </button>
                <label className="sort-select">
                  <span>Sort by</span>
                  <select
                    value={sort}
                    onChange={(event) =>
                      setParam('sort', event.target.value === 'featured' ? '' : event.target.value)
                    }
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="active-filters">
                {activeFilters.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    className="active-filter"
                    onClick={() => removeFilter(filter.key)}
                  >
                    {filter.label}
                    <X size={13} />
                  </button>
                ))}
                <button type="button" className="active-filters__clear" onClick={clearAll}>
                  Clear all
                </button>
              </div>
            )}

            {state.source === 'local' && state.error && (
              <div className="offline-banner">
                <WifiOff size={16} />
                <span>
                  The live API is offline, so you are browsing the local catalog. Start the server
                  for live inventory.
                </span>
                <button type="button" onClick={load}>
                  <RefreshCw size={14} /> Retry
                </button>
              </div>
            )}

            <div className="results-meta">
              <span>
                {state.loading
                  ? 'Loading products...'
                  : `Showing ${shown.length} of ${results.length} products`}
              </span>
              {!state.loading && state.source === 'api' && (
                <span className="live-pill">Live inventory</span>
              )}
            </div>

            {state.loading ? (
              <ProductGridSkeleton count={9} />
            ) : state.error && results.length === 0 ? (
              <div className="error-panel">
                <AlertCircle size={22} />
                <div>
                  <strong>We could not load the collection.</strong>
                  <p>{state.error.message || 'Please try again in a moment.'}</p>
                </div>
                <button type="button" className="btn btn--ghost" onClick={load}>
                  <RefreshCw size={16} /> Try again
                </button>
              </div>
            ) : results.length === 0 ? (
              <EmptyState
                title="No products match those filters"
                description="Try widening your price range or clearing a filter to see more of the collection."
                action={{ label: 'Clear all filters', onClick: clearAll }}
              />
            ) : (
              <>
                <div className="product-grid">
                  {shown.map((product, index) => (
                    <Reveal key={product.id} delay={Math.min(index, 6) * 40}>
                      <ProductCard product={product} />
                    </Reveal>
                  ))}
                </div>
                {visible < results.length && (
                  <div className="load-more">
                    <button
                      type="button"
                      className="btn btn--ghost btn--lg"
                      onClick={() => setVisible((current) => current + PAGE_SIZE)}
                    >
                      Load more products <ArrowRight size={17} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
