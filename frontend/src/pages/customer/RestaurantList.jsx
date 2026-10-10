import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRestaurants } from '../../api/restaurantApi';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data.restaurants);
      } catch (err) {
        setError('Failed to load restaurants');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const filtered = restaurants.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.cuisine?.some((c) => c.toLowerCase().includes(q))
    );
  });

  return (
    <div className="page-container fade-in">
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Restaurants</h1>
      <p style={{ color: 'var(--color-text-muted)', marginTop: 0, marginBottom: 20 }}>
        Discover great food near you
      </p>

      <input
        type="text"
        placeholder="🔍 Search by name or cuisine..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field"
        style={{ maxWidth: 360, marginBottom: 28 }}
      />

      {loading && <Spinner label="Loading restaurants..." />}

      {error && (
        <EmptyState icon="⚠️" title="Something went wrong" subtitle={error} />
      )}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          icon="🔍"
          title="No restaurants found"
          subtitle={search ? `No results for "${search}"` : 'Check back soon for new restaurants.'}
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid-cards">
          {filtered.map((r) => (
            <Link
              key={r._id}
              to={`/restaurant/${r._id}`}
              className="card card-hover fade-in"
              style={{ textDecoration: 'none', color: 'inherit', overflow: 'hidden' }}
            >
              <div
                style={{
                  height: 130,
                  background: 'linear-gradient(135deg, var(--color-primary-light), #fed7aa)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 44,
                }}
              >
                🍛
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: '0 0 4px', fontSize: 16 }}>{r.name}</h3>
                  {r.rating > 0 && (
                    <span style={{ fontSize: 13, color: 'var(--color-warning)', fontWeight: 700 }}>
                      ⭐ {r.rating}
                    </span>
                  )}
                </div>
                <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--color-text-muted)' }}>
                  {r.description}
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  {r.cuisine?.map((c) => (
                    <span
                      key={c}
                      style={{
                        fontSize: 11,
                        background: 'var(--color-primary-light)',
                        color: 'var(--color-primary-dark)',
                        padding: '3px 8px',
                        borderRadius: 999,
                        fontWeight: 600,
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>
                  🕐 {r.openingHours}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;