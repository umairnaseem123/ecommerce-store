import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../../api/orderApi';
import Spinner from '../../components/Spinner';
import '../../styles/cart-chop.css';

const STEPS = [
  ['pending', 'Order placed'],
  ['confirmed', 'Confirmed'],
  ['preparing', 'Preparing'],
  ['out_for_delivery', 'On the way'],
  ['delivered', 'Delivered'],
];
const LABEL = {
  pending: 'Order placed', confirmed: 'Confirmed', preparing: 'Preparing',
  out_for_delivery: 'Out for delivery', delivered: 'Delivered', cancelled: 'Cancelled',
};

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const status = order?.status;
  const live = order && !['delivered', 'cancelled'].includes(status);

  useEffect(() => {
    let alive = true;
    const load = async (silent) => {
      try {
        const data = await getOrderById(id);
        if (alive) setOrder(data.order);
      } catch (err) {
        if (alive && !silent) setError('Failed to load order details');
      } finally {
        if (alive && !silent) setLoading(false);
      }
    };
    load(false);
    return () => { alive = false; };
  }, [id]);

  // Refresh the status every 10 seconds until the order is delivered or cancelled.
  useEffect(() => {
    if (!live) return undefined;
    let alive = true;
    const t = setInterval(async () => {
      try {
        const data = await getOrderById(id);
        if (alive) setOrder(data.order);
      } catch (err) { /* keep showing the last status */ }
    }, 10000);
    return () => { alive = false; clearInterval(t); };
  }, [live, id]);

  if (loading) return <Spinner label="Loading order..." />;
  if (error) {
    return (
      <div className="cc-page"><div className="cc-wrap">
        <div className="cc-card cc-empty"><h2>Something went wrong</h2><p>{error}</p><Link to="/my-orders" className="cc-btn cc-btn--auto">My orders</Link></div>
      </div></div>
    );
  }

  const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = order.totalAmount ?? subtotal;
  const discount = order.discount || 0;
  const current = STEPS.findIndex(([key]) => key === status);
  const cancelled = status === 'cancelled';
  const justPlaced = status === 'pending';
  const addr = order.deliveryAddress;

  return (
    <div className="cc-page">
      <div className="cc-wrap">
        <div className="cc-center">
          {justPlaced && (
            <div className="cc-success" aria-hidden="true">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>
            </div>
          )}
          <h1>{justPlaced ? 'Order placed successfully!' : 'Your order'}</h1>
          <p className="cc-sub">
            {justPlaced ? 'Thanks for your order. The restaurant has been notified.' : `Order #${String(order._id).slice(-6).toUpperCase()}`}
          </p>
        </div>

        <div className="cc-layout">
          <div className="cc-rows">
            <section className="cc-card cc-card--pad">
              <div className="cc-order__top">
                <h3>Order status</h3>
                <span className={`cc-pill ${cancelled ? 'cc-pill--bad' : status === 'delivered' ? 'cc-pill--done' : ''}`}>{LABEL[status] || status}</span>
              </div>
              {cancelled ? (
                <p className="cc-alert" style={{ marginTop: 16 }}>This order was cancelled.</p>
              ) : (
                <ol className="cc-track">
                  {STEPS.map(([key, label], i) => (
                    <li key={key} className={`${i <= current ? 'is-done' : ''} ${i === current ? 'is-current' : ''}`}>{label}</li>
                  ))}
                </ol>
              )}
              {live && <p className="cc-live" style={{ marginTop: 14 }}><i /> Updating live</p>}
            </section>

            <section className="cc-card cc-card--pad">
              <h3>Items</h3>
              <div className="cc-lines">
                {order.items.map((item, idx) => (
                  <div key={idx} className="cc-line cc-line--ink">
                    <span>{item.name} x {item.quantity}</span>
                    <span>Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
                {discount > 0 && (
                  <div className="cc-line"><span>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</span><span className="cc-free">- Rs. {discount}</span></div>
                )}
                <div className="cc-line cc-line--total"><span>Total</span><span>Rs. {total}</span></div>
              </div>
            </section>
          </div>

          <aside className="cc-card cc-card--pad cc-summary">
            <h3>Delivery address</h3>
            <p className="cc-order__meta">{addr?.street}, {addr?.city}, {addr?.state} {addr?.zip}</p>
            <h3 style={{ marginTop: 20 }}>Payment</h3>
            <p className="cc-order__meta" style={{ textTransform: 'capitalize' }}>{order.paymentMethod}</p>
            <p className="cc-order__meta" style={{ wordBreak: 'break-all', marginTop: 20 }}>Order ID: #{order._id}</p>
            <Link to="/my-orders" className="cc-btn">Track order</Link>
            <Link to="/restaurants" className="cc-btn cc-btn--ghost">Order more</Link>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
