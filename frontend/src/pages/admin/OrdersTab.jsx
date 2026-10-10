import { useEffect, useState } from 'react';
import { getAllOrdersAdmin } from '../../api/adminApi';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllOrdersAdmin();
        setOrders(data.orders);
      } catch (err) {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Spinner label="Loading orders..." />;
  if (error) return <EmptyState icon="⚠️" title="Error" subtitle={error} />;
  if (orders.length === 0) return <EmptyState icon="📦" title="No orders found" />;

  const totalRevenue = orders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.quantity, 0),
    0
  );
  const statuses = ['all', 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div style={{ display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="card" style={{ padding: 16, flex: 1, minWidth: 160, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 24 }}>📦</div>
          <div>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{orders.length}</p>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>Total Orders</p>
          </div>
        </div>
        <div className="card" style={{ padding: 16, flex: 1, minWidth: 160, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 24 }}>💰</div>
          <div>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Rs. {totalRevenue}</p>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>Total Revenue</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {statuses.map((s) => (
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

      <div style={{ display: 'grid', gap: 12 }}>
        {filteredOrders.map((order) => {
          const total = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
          return (
            <div key={order._id} className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15 }}>{order.restaurant?.name}</h4>
                  <p style={{ margin: '4px 0', fontSize: 13, color: 'var(--color-text-muted)' }}>
                    {order.user?.name} — {order.user?.email}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <p style={{ marginTop: 10, marginBottom: 0, fontWeight: 800 }}>Total: Rs. {total}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersTab;