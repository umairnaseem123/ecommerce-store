import { useEffect, useState } from 'react';
import { getAllRestaurantsAdmin, updateRestaurantStatus } from '../../api/adminApi';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import SmartImage from '../../components/SmartImage';

const muted = { margin: 0, fontSize: 13, color: 'var(--color-text-muted)' };

const Stat = ({ icon, value, label }) => (
  <div className="card" style={{ padding: 16, flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
    <div style={{ fontSize: 24 }}>{icon}</div>
    <div>
      <p style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{value}</p>
      <p style={muted}>{label}</p>
    </div>
  </div>
);

const RestaurantsTab = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadRestaurants = async () => {
    try {
      const data = await getAllRestaurantsAdmin();
      setRestaurants(data.restaurants);
    } catch (err) {
      setError('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    setUpdatingId(id);
    try {
      await updateRestaurantStatus(id, !currentStatus);
      await loadRestaurants();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Spinner label="Loading stores..." />;
  if (error) return <EmptyState icon="⚠️" title="Error" subtitle={error} />;
  if (restaurants.length === 0) return <EmptyState icon="🏪" title="No stores found" />;

  const activeCount = restaurants.filter((r) => r.isActive).length;

  return (
    <div>
      <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
        <Stat icon="🏪" value={restaurants.length} label="Total stores" />
        <Stat icon="✅" value={activeCount} label="Active" />
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {restaurants.map((r) => (
          <div key={r._id} className="card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, opacity: r.isActive ? 1 : 0.65 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <SmartImage
                src={r.coverImage}
                alt={r.name}
                style={{ width: 56, height: 56, borderRadius: 10 }}
                fallback="🍽"
              />
              <div>
                <h3 style={{ margin: 0, fontSize: 16 }}>{r.name}</h3>
                <p style={{ ...muted, margin: '2px 0 6px' }}>Owner: {r.owner?.name} ({r.owner?.email})</p>
                <span className="badge" style={{ background: r.isActive ? 'var(--color-success)' : 'var(--color-danger)' }}>
                  {r.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleToggleStatus(r._id, r.isActive)}
              disabled={updatingId === r._id}
              className={r.isActive ? 'btn btn-danger-outline btn-sm' : 'btn btn-primary btn-sm'}
            >
              {r.isActive ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantsTab;
