import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../../api/orderApi';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyOrders();
        setOrders(data.orders);
      } catch (err) {
        setError('Failed to load your orders');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="theme-tracking fade-in">
      <div className="ds-container" style={{ maxWidth: 860, paddingBlock: 'var(--s-7)' }}>
        <h1 style={{ fontSize: 'var(--fs-xl)' }}>My orders</h1>
        <p className="ds-rcard__meta" style={{ margin: '6px 0 var(--s-5)' }}>Track your past and current orders</p>

        {loading && (
          <div style={{ display: 'grid', gap: 'var(--s-3)' }}>
            {[...Array(3)].map((_, i) => <div key={i} className="ds-skeleton" style={{ height: 150 }} />)}
          </div>
        )}

        {error && <EmptyState icon="⚠️" title="Error" subtitle={error} />}

        {!loading && !error && orders.length === 0 && (
          <EmptyState
            icon="📦"
            title="No orders yet"
            subtitle="When you place an order, it'll show up here."
            action={<Link to="/restaurants" className="ds-btn" style={{ marginTop: 16 }}>Browse stores</Link>}
          />
        )}

        <div style={{ display: 'grid', gap: 'var(--s-4)' }}>
          {orders.map((order) => {
            const total = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
            return (
              <Link
                key={order._id}
                to={`/order-confirmation/${order._id}`}
                className="ds-card ds-order"
              >
                <div className="ds-rcard__row" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem' }}>{order.restaurant?.name || 'Restaurant'}</h3>
                    <p className="ds-rcard__meta" style={{ margin: '4px 0 0' }}>
                      Order #{String(order._id).slice(-6).toUpperCase()} · {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="ds-order__items">
                  {order.items.map((item, idx) => (
                    <span key={idx}>{item.name} × {item.quantity}</span>
                  ))}
                </div>

                <div className="ds-rcard__row">
                  <strong className="ds-dish__price">Rs. {total}</strong>
                  <span className="ds-link">View details →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
