import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getRestaurants } from '../../api/restaurantApi';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';

const Home = () => {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data.restaurants.slice(0, 6));
      } catch (err) {
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, #f97316 50%, #fb923c 100%)',
          color: '#fff',
          padding: '72px 20px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, margin: '0 0 12px' }}>
            Hey {user?.name?.split(' ')[0]}, hungry? 🍽️
          </h1>
          <p style={{ fontSize: 17, opacity: 0.95, margin: '0 0 28px' }}>
            Order delicious food from the best restaurants near you — fast, fresh, and delivered to your door.
          </p>
          <Link
            to="/restaurants"
            className="btn"
            style={{
              background: '#fff',
              color: 'var(--color-primary)',
              padding: '14px 32px',
              fontSize: 16,
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            Browse Restaurants →
          </Link>
        </div>
      </div>

      {/* Quick links */}
      <div className="page-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            marginBottom: 48,
          }}
        >
          <Link to="/restaurants" className="card card-hover" style={{ padding: 20, textDecoration: 'none', textAlign: 'center' }}>
            <div style={{ fontSize: 28 }}>🍔</div>
            <p style={{ fontWeight: 700, margin: '8px 0 0', color: 'var(--color-text)' }}>Browse Restaurants</p>
          </Link>
          <Link to="/cart" className="card card-hover" style={{ padding: 20, textDecoration: 'none', textAlign: 'center' }}>
            <div style={{ fontSize: 28 }}>🛒</div>
            <p style={{ fontWeight: 700, margin: '8px 0 0', color: 'var(--color-text)' }}>View Cart</p>
          </Link>
          <Link to="/my-orders" className="card card-hover" style={{ padding: 20, textDecoration: 'none', textAlign: 'center' }}>
            <div style={{ fontSize: 28 }}>📦</div>
            <p style={{ fontWeight: 700, margin: '8px 0 0', color: 'var(--color-text)' }}>Track Orders</p>
          </Link>
        </div>

        {/* Featured Restaurants */}
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Popular Restaurants</h2>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 0, marginBottom: 20 }}>
          Hand-picked places our customers love
        </p>

        {loading && <Spinner label="Finding great food nearby..." />}

        {!loading && restaurants.length === 0 && (
          <EmptyState
            icon="🍽️"
            title="No restaurants available yet"
            subtitle="Check back soon — new places are joining all the time."
          />
        )}

        {!loading && restaurants.length > 0 && (
          <div className="grid-cards">
            {restaurants.map((r) => (
              <Link
                key={r._id}
                to={`/restaurant/${r._id}`}
                className="card card-hover fade-in"
                style={{ textDecoration: 'none', color: 'inherit', overflow: 'hidden' }}
              >
                <div
                  style={{
                    height: 120,
                    background: 'linear-gradient(135deg, var(--color-primary-light), #fed7aa)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 40,
                  }}
                >
                  🍛
                </div>
                <div style={{ padding: 16 }}>
                  <h3 style={{ margin: '0 0 4px', fontSize: 16 }}>{r.name}</h3>
                  <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--color-text-muted)' }}>
                    {r.description}
                  </p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
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
    </div>
  );
};

export default Home;