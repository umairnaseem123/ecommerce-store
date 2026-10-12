import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getRestaurants } from '../../api/restaurantApi';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import SmartImage from '../../components/SmartImage';
import '../../styles/store.css';

const RestaurantList = () => {
  const [params, setParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(params.get('q') || '');
  const cuisine = params.get('cuisine') || '';

  useEffect(() => {
    getRestaurants()
      .then((d) => setRestaurants(d.restaurants || []))
      .catch(() => setError('Failed to load stores. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const cuisines = useMemo(
    () => [...new Set(restaurants.flatMap((r) => r.cuisine || []))],
    [restaurants]
  );

  const filtered = restaurants.filter((r) => {
    const q = search.toLowerCase();
    const matchesText =
      !q || r.name.toLowerCase().includes(q) || r.cuisine?.some((c) => c.toLowerCase().includes(q));
    const matchesCuisine = !cuisine || r.cuisine?.includes(cuisine);
    return matchesText && matchesCuisine;
  });

  const setCuisine = (c) => {
    const next = new URLSearchParams(params);
    if (c) next.set('cuisine', c);
    else next.delete('cuisine');
    setParams(next, { replace: true });
  };

  return (
    <div className="page-container fade-in">
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Stores</h1>
      <p style={{ color: 'var(--color-text-muted)', marginTop: 0, marginBottom: 20 }}>
        Discover great food near you
      </p>

      <input
        type="text"
        placeholder="Search by store name or cuisine..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field"
        style={{ maxWidth: 420, marginBottom: 16 }}
      />

      {cuisines.length > 0 && (
        <div className="chips" style={{ marginBottom: 26 }}>
          <button className={`chip ${!cuisine ? 'active' : ''}`} onClick={() => setCuisine('')}>All</button>
          {cuisines.map((c) => (
            <button key={c} className={`chip ${cuisine === c ? 'active' : ''}`} onClick={() => setCuisine(c)}>
              {c}
            </button>
          ))}
        </div>
      )}

      {loading && <Spinner label="Loading stores..." />}
      {error && <EmptyState icon="⚠️" title="Something went wrong" subtitle={error} />}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          icon="🔍"
          title="No stores found"
          subtitle={search || cuisine ? 'Try a different search or cuisine.' : 'Check back soon for new stores.'}
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="store-grid">
          {filtered.map((r) => (
            <Link key={r._id} to={`/restaurant/${r._id}`} className="card card-hover store-card fade-in">
              <SmartImage src={r.coverImage} alt={r.name} className="store-cover" style={{ height: 170 }} fallback="🍽" />
              <div className="store-body">
                <div className="store-title">
                  <h3>{r.name}</h3>
                  {r.rating > 0 && <span className="rating">{r.rating} ★</span>}
                </div>
                <p className="store-meta">{r.description}</p>
                {r.cuisine?.map((c) => <span className="tag" key={c}>{c}</span>)}
                <p className="store-meta" style={{ marginTop: 10 }}>{r.openingHours}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
