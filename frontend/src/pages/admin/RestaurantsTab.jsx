import { useEffect, useState } from 'react';
import { getAllRestaurantsAdmin, updateRestaurantStatus } from '../../api/adminApi';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';

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
      setError('Failed to load restaurants');
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

  if (loading) return <Spinner label="Loading restaurants..." />;
  if (error) return <EmptyState icon="⚠️" title="Error" subtitle={error} />;
  if (restaurants.length === 0) return <EmptyState icon="🏪" title="No restaurants found" />;

  const activeCount = restaurants.filter((r) => r.isActive).length;

  return (
    <div>
      <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
        <div className="card" style={{ padding: 16, flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 24 }}>🏪</div>
          <div>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{restaurants.length}</p>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>Total Restaurants</p>
          </div>
        </div>
        <div className="card" style={{ padding: 16, flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 24 }}>✅</div>
          <div>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{activeCount}</p>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>Active</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {restaurants.map((r) => (
          <div
            key={r._id}
            className="card"
            style={{
              padding: 18,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 48, height: 48, borderRadius: 10,
                  background: 'linear-gradient(135deg, var(--color-primary-light), #fed7aa)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                }}
              >
                🍛
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 16 }}>{r.name}</h3>
                <p style={{ margin: '2px 0', fontSize: 13, color: 'var(--color-text-muted)' }}>
                  Owner: {r.owner?.name} ({r.owner?.email})
                </p>
                <span className="badge" style={{ background: r.isActive ? 'var(--color-success)' : 'var(--color-danger)', marginTop: 4 }}>
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