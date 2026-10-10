import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../../api/orderApi';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data.order);
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Spinner label="Loading order..." />;
  if (error) return <div className="page-container-narrow"><EmptyState icon="⚠️" title="Error" subtitle={error} /></div>;

  const total = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="page-container-narrow fade-in">
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 56 }}>🎉</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: '8px 0 4px', color: 'var(--color-success)' }}>
          Order Placed Successfully!
        </h1>
        <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
          Thanks for your order — the restaurant has been notified.
        </p>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Order ID</span>
          <StatusBadge status={order.status} />
        </div>
        <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 13, color: 'var(--color-text-muted)' }}>
          #{order._id}
        </p>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 15 }}>Items</h3>
        {order.items.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
            <span>{item.name} × {item.quantity}</span>
            <span style={{ fontWeight: 600 }}>Rs. {item.price * item.quantity}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, marginTop: 10, borderTop: '1px solid var(--color-border)', fontWeight: 800, fontSize: 16 }}>
          <span>Total</span>
          <span>Rs. {total}</span>
        </div>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <h3 style={{ marginTop: 0, marginBottom: 10, fontSize: 15 }}>📍 Delivery Address</h3>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-muted)' }}>
          {order.deliveryAddress?.street}, {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.zip}
        </p>
        <p style={{ margin: '10px 0 0', fontSize: 14, color: 'var(--color-text-muted)' }}>
          💳 Payment: <strong style={{ color: 'var(--color-text)', textTransform: 'capitalize' }}>{order.paymentMethod}</strong>
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/restaurants" className="btn btn-outline" style={{ flex: 1, textAlign: 'center' }}>
          ← Order More
        </Link>
        <Link to="/my-orders" className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>
          Track Order
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;