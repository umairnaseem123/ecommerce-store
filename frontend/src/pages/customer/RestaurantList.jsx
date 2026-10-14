import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getRestaurants } from '../../api/restaurantApi';
import EmptyState from '../../components/EmptyState';
import StoreCard from '../../components/StoreCard';

const RestaurantList = () => {
  const [params, setParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(params.get('q') || '');
  const [sort, setSort] = useState('rating');
  const cuisine = params.get('cuisine') || '';

  useEffect(() => {
    getRestaurants()
      .then((d) => setRestaurants(d.restaurants || []))
      .catch(() => setError('Failed to load stores. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const cuisines = useMemo(() => [...new Set(restaurants.flatMap((r) => r.cuisine || []))], [restaurants]);

  const list = useMemo(() => {
    const q = search.toLowerCase();
    const filtered = restaurants.filter((r) => {
      const matchesText = !q || r.name.toLowerCase().includes(q) || r.cuisine?.some((c) => c.toLowerCase().includes(q));
      const matchesCuisine = !cuisine || r.cuisine?.includes(cuisine);
      return matchesText && matchesCuisine;
    });
    return filtered.sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name) : (b.rating || 0) - (a.rating || 0)));
  }, [restaurants, search, cuisine, sort]);

  const setCuisine = (c) => {
    const next = new URLSearchParams(params);
    if (c) next.set('cuisine', c);
    else next.delete('cuisine');
    setParams(next, { replace: true });
  };

  return (
    <div className="theme-explore fade-in">
      <div className="ds-container" style={{ paddingBlock: 'var(--s-7)' }}>
        <h1 style={{ fontSize: 'var(--fs-xl)' }}>Stores near you</h1>
        <p className="ds-rcard__meta" style={{ margin: '6px 0 var(--s-5)' }}>Discover great food and order in minutes.</p>

        <div className="ds-toolbar">
          <div className="ds-search" style={{ flex: 1, maxWidth: 480 }}>
            <input
              type="text"
              placeholder="Search by store name or cuisine..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="ds-input" style={{ width: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort stores">
            <option value="rating">Top rated</option>
            <option value="name">Name (A to Z)</option>
          </select>
        </div>

        {cuisines.length > 0 && (
          <div className="ds-chips" style={{ margin: 'var(--s-4) 0 var(--s-6)' }}>
            <button className={`ds-chip ${!cuisine ? 'is-active' : ''}`} onClick={() => setCuisine('')}>All</button>
            {cuisines.map((c) => (
              <button key={c} className={`ds-chip ${cuisine === c ? 'is-active' : ''}`} onClick={() => setCuisine(c)}>{c}</button>
            ))}
          </div>
        )}

        {loading && (
          <div className="ds-grid">
            {[...Array(6)].map((_, i) => <div key={i} className="ds-skeleton ds-skeleton--card" />)}
          </div>
        )}
        {error && <EmptyState icon="⚠️" title="Something went wrong" subtitle={error} />}
        {!loading && !error && list.length === 0 && (
          <EmptyState
            icon="🔍"
            title="No stores found"
            subtitle={search || cuisine ? 'Try a different search or cuisine.' : 'Check back soon for new stores.'}
          />
        )}
        {!loading && !error && list.length > 0 && (
          <div className="ds-grid">{list.map((r) => <StoreCard key={r._id} store={r} />)}</div>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
