import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../../api/orderApi';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data.orders);
      } catch (err) {
        setError('Failed to load your orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Spinner label="Loading your orders..." />;
  if (error) return <div className="page-container"><EmptyState icon="⚠️" title="Error" subtitle={error} /></div>;

  return (
    <div className="page-container fade-in">
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>My Orders</h1>
      <p style={{ color: 'var(--color-text-muted)', marginTop: 0, marginBottom: 24 }}>
        Track your past and current orders
      </p>

      {orders.length === 0 && (
        <EmptyState
          icon="📦"
          title="No orders yet"
          subtitle="When you place an order, it'll show up here."
          action={
            <Link to="/restaurants" className="btn btn-primary" style={{ marginTop: 16 }}>
              Browse Restaurants
            </Link>
          }
        />
      )}

      <div style={{ display: 'grid', gap: 14 }}>
        {orders.map((order) => {
          const total = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
          return (
            <Link
              key={order._id}
              to={`/order-confirmation/${order._id}`}
              className="card card-hover fade-in"
              style={{ textDecoration: 'none', color: 'inherit', padding: 18, display: 'block' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16 }}>{order.restaurant?.name || 'Restaurant'}</h3>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--color-text-muted)' }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--color-border)' }}>
                {order.items.map((item, idx) => (
                  <p key={idx} style={{ margin: '2px 0', fontSize: 14, color: 'var(--color-text-muted)' }}>
                    {item.name} × {item.quantity}
                  </p>
                ))}
              </div>

              <p style={{ marginTop: 10, marginBottom: 0, fontWeight: 800, fontSize: 16 }}>
                Total: Rs. {total}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;