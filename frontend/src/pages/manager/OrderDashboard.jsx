import { useEffect, useState } from 'react';
import { getMyRestaurants } from '../../api/restaurantApi';
import { getRestaurantOrders, updateOrderStatus } from '../../api/orderApi';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';

const statusFlow = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

const nextStatus = (current) => {
  const idx = statusFlow.indexOf(current);
  return idx >= 0 && idx < statusFlow.length - 1 ? statusFlow[idx + 1] : null;
};

const StatCard = ({ label, value, icon, color }) => (
  <div className="card" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
    <div
      style={{
        width: 44, height: 44, borderRadius: 12, background: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
      }}
    >
      {icon}
    </div>
    <div>
      <p style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{value}</p>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>{label}</p>
    </div>
  </div>
);

const OrderDashboard = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState('all');

  const loadOrders = async (restaurantId) => {
    try {
      const data = await getRestaurantOrders(restaurantId);
      setOrders(data.orders);
    } catch (err) {
      setError('Failed to load orders');
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const resData = await getMyRestaurants();
        if (resData.restaurants.length === 0) {
          setError('No restaurant found for this manager account');
          setLoading(false);
          return;
        }
        const myRestaurant = resData.restaurants[0];
        setRestaurant(myRestaurant);
        await loadOrders(myRestaurant._id);
      } catch (err) {
        setError('Failed to load restaurant');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadOrders(restaurant._id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Spinner label="Loading dashboard..." />;
  if (error) return <div className="page-container"><EmptyState icon="⚠️" title="Error" subtitle={error} /></div>;

  const activeOrders = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status));
  const revenueToday = orders
    .filter((o) => new Date(o.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.quantity, 0), 0);

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="page-container fade-in">
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>{restaurant.name}</h1>
      <p style={{ color: 'var(--color-text-muted)', marginTop: 0, marginBottom: 24 }}>
        Manage incoming orders in real time
      </p>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
        <StatCard label="Total Orders" value={orders.length} icon="📦" color="var(--color-primary-light)" />
        <StatCard label="Active Orders" value={activeOrders.length} icon="🔥" color="#fef3c7" />
        <StatCard label="Revenue Today" value={`Rs. ${revenueToday}`} icon="💰" color="#dcfce7" />
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', ...statusFlow, 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: '6px 14px',
              borderRadius: 999,
              border: `1px solid ${filter === s ? 'var(--color-primary)' : 'var(--color-border)'}`,
              background: filter === s ? 'var(--color-primary-light)' : '#fff',
              color: filter === s ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <EmptyState icon="📭" title="No orders here" subtitle="Orders matching this filter will show up here." />
      )}

      <div style={{ display: 'grid', gap: 14 }}>
        {filteredOrders.map((order) => {
          const total = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
          const upcoming = nextStatus(order.status);

          return (
            <div key={order._id} className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16 }}>{order.user?.name || 'Customer'}</h3>
                  <p style={{ margin: '2px 0', fontSize: 13, color: 'var(--color-text-muted)' }}>{order.user?.email}</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--color-border)' }}>
                {order.items.map((item, idx) => (
                  <p key={idx} style={{ margin: '2px 0', fontSize: 14 }}>
                    {item.name} × {item.quantity} <span style={{ color: 'var(--color-text-muted)' }}>— Rs. {item.price * item.quantity}</span>
                  </p>
                ))}
              </div>

              <p style={{ fontWeight: 800, marginTop: 10, marginBottom: 0 }}>Total: Rs. {total}</p>

              <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {upcoming && order.status !== 'cancelled' && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, upcoming)}
                    disabled={updatingId === order._id}
                    className="btn btn-primary btn-sm"
                  >
                    {updatingId === order._id ? 'Updating...' : `Mark as ${upcoming.replace(/_/g, ' ')}`}
                  </button>
                )}
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                    disabled={updatingId === order._id}
                    className="btn btn-danger-outline btn-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderDashboard;