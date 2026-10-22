import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyOrders } from '../../api/orderApi';
import { addToCart } from '../../api/cartApi';
import { useCart } from '../../context/CartContext';
import Spinner from '../../components/Spinner';
import '../../styles/cart-chop.css';

const LABEL = {
  pending: 'Order placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};
const pillClass = (s) => (s === 'delivered' ? 'cc-pill--done' : s === 'cancelled' ? 'cc-pill--bad' : s === 'pending' ? '' : 'cc-pill--live');
const isActive = (s) => !['delivered', 'cancelled'].includes(s);

const MyOrders = () => {
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async (silent = false) => {
    try {
      const data = await getMyOrders();
      setOrders(data.orders);
      setError('');
    } catch (err) {
      if (!silent) setError('Failed to load your orders');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Refresh every 15 seconds while any order is still in progress.
  const hasActive = orders.some((o) => isActive(o.status));
  useEffect(() => {
    if (!hasActive) return undefined;
    const t = setInterval(() => load(true), 15000);
    return () => clearInterval(t);
  }, [hasActive, load]);

  const reorder = async (order) => {
    setBusyId(order._id);
    setNotice('');
    let failed = 0;
    for (const item of order.items) {
      try {
        await addToCart(item.menuItem, item.quantity);
      } catch (err) {
        failed += 1;
      }
    }
    try { await refreshCart(); } catch (err) { /* cart page will reload it */ }
    setBusyId(null);
    if (failed === order.items.length) {
      setNotice('Could not add these items. Your cart may have items from another restaurant, or the dishes are no longer available.');
    } else {
      navigate('/cart');
    }
  };

  if (loading) return <Spinner label="Loading your orders..." />;

  return (
    <div className="cc-page">
      <div className="cc-wrap" style={{ maxWidth: 860 }}>
        <h1>My orders</h1>
        <p className="cc-sub">
          Track your past and current orders.{' '}
          {hasActive && <span className="cc-live"><i /> Updating live</span>}
        </p>

        {notice && <div className="cc-notice" role="alert">{notice}</div>}
        {error && <div className="cc-alert" role="alert">{error}</div>}

        {!error && orders.length === 0 && (
          <div className="cc-card cc-empty">
            <h2>No orders yet</h2>
            <p>When you place an order, it will show up here.</p>
            <Link to="/restaurants" className="cc-btn cc-btn--auto">Browse restaurants</Link>
          </div>
        )}

        <div className="cc-orders">
          {orders.map((order) => {
            const total = order.totalAmount ?? order.items.reduce((s, i) => s + i.price * i.quantity, 0);
            return (
              <article key={order._id} className="cc-card cc-order">
                <div className="cc-order__top">
                  <div>
                    <h3>{order.restaurant?.name || 'Restaurant'}</h3>
                    <p className="cc-order__meta">
                      Order #{String(order._id).slice(-6).toUpperCase()} | {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={`cc-pill ${pillClass(order.status)}`}>{LABEL[order.status] || order.status}</span>
                </div>

                <div className="cc-order__items">
                  {order.items.map((item, idx) => (
                    <span key={idx}>{item.name} x {item.quantity}</span>
                  ))}
                </div>

                <div className="cc-order__foot">
                  <strong className="cc-order__total">Rs. {total}</strong>
                  <div className="cc-actions">
                    <Link to={`/order-confirmation/${order._id}`} className="cc-link">View details</Link>
                    <button type="button" className="cc-btn cc-btn--sm" disabled={busyId === order._id} onClick={() => reorder(order)}>
                      {busyId === order._id ? 'Adding...' : 'Order again'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
