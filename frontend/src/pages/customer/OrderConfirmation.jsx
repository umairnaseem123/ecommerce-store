import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../../api/orderApi';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';

const STEPS = [
  ['pending', 'Order placed'],
  ['confirmed', 'Confirmed by the store'],
  ['preparing', 'Preparing your food'],
  ['out_for_delivery', 'Out for delivery'],
  ['delivered', 'Delivered'],
];

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data.order);
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Spinner label="Loading order..." />;
  if (error) return <div className="ds-container" style={{ maxWidth: 720, paddingBlock: 'var(--s-7)' }}><EmptyState icon="⚠️" title="Error" subtitle={error} /></div>;

  const total = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const current = STEPS.findIndex(([key]) => key === order.status);
  const cancelled = order.status === 'cancelled';
  const justPlaced = order.status === 'pending';
  const addr = order.deliveryAddress;

  return (
    <div className="theme-tracking fade-in">
      <div className="ds-container" style={{ maxWidth: 960, paddingBlock: 'var(--s-7)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--s-6)' }}>
          {justPlaced && <div className="ds-success" aria-hidden="true">✓</div>}
          <h1 style={{ fontSize: 'var(--fs-xl)', margin: '12px 0 6px' }}>
            {justPlaced ? 'Order placed successfully!' : 'Your order'}
          </h1>
          <p className="ds-rcard__meta" style={{ margin: '0 auto' }}>
            {justPlaced ? 'Thanks for your order. The store has been notified.' : `Order #${String(order._id).slice(-6).toUpperCase()}`}
          </p>
        </div>

        <div className="ds-cart">
          <div style={{ display: 'grid', gap: 'var(--s-4)' }}>
            <section className="ds-card ds-card--pad">
              <div className="ds-rcard__row" style={{ marginBottom: 'var(--s-4)' }}>
                <h3>Order status</h3>
                <StatusBadge status={order.status} />
              </div>
              {cancelled ? (
                <p className="ds-alert">This order was cancelled.</p>
              ) : (
                <ol className="ds-steps">
                  {STEPS.map(([key, label], i) => (
                    <li key={key} className={`ds-step ${i < current ? 'is-done' : ''} ${i === current ? 'is-current is-done' : ''}`}>
                      {label}
                    </li>
                  ))}
                </ol>
              )}
            </section>

            <section className="ds-card ds-card--pad">
              <h3 style={{ marginBottom: 'var(--s-4)' }}>Items</h3>
              <div className="ds-lines">
                {order.items.map((item, idx) => (
                  <div key={idx} className="ds-line" style={{ color: 'var(--text)' }}>
                    <span>{item.name} × {item.quantity}</span>
                    <span style={{ fontWeight: 600 }}>Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="ds-line ds-line--total"><span>Total</span><span>Rs. {total}</span></div>
              </div>
            </section>
          </div>

          <aside className="ds-card ds-card--pad ds-cart__summary">
            <h3 style={{ marginBottom: 'var(--s-3)' }}>Delivery address</h3>
            <p className="ds-rcard__meta" style={{ margin: 0 }}>
              {addr?.street}, {addr?.city}, {addr?.state} {addr?.zip}
            </p>
            <h3 style={{ margin: 'var(--s-5) 0 var(--s-3)' }}>Payment</h3>
            <p className="ds-rcard__meta" style={{ margin: 0, textTransform: 'capitalize' }}>{order.paymentMethod}</p>
            <p className="ds-rcard__meta" style={{ margin: 'var(--s-5) 0 0', wordBreak: 'break-all' }}>Order ID: #{order._id}</p>
            <Link to="/my-orders" className="ds-btn ds-btn--block" style={{ marginTop: 'var(--s-5)' }}>Track order</Link>
            <Link to="/restaurants" className="ds-btn ds-btn--ghost ds-btn--block" style={{ marginTop: 'var(--s-3)' }}>Order more</Link>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
