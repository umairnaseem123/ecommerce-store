import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../api/orderApi';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';

const Checkout = () => {
  const { cart, loading, refreshCart } = useCart();
  const navigate = useNavigate();

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (loading) return <Spinner label="Loading checkout..." />;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="page-container-narrow">
        <EmptyState icon="🛒" title="Your cart is empty" subtitle="Add some items before checking out." />
      </div>
    );
  }

  const total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!street || !city || !state || !zip) {
      setError('Please fill in all delivery address fields');
      return;
    }

    setSubmitting(true);
    try {
      const data = await createOrder({
        deliveryAddress: { street, city, state, zip },
        paymentMethod,
      });
      await refreshCart();
      navigate(`/order-confirmation/${data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container-narrow fade-in">
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 20 }}>Checkout</h1>

      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 16 }}>Order Summary</h3>
        {cart.items.map((item) => (
          <div key={item.menuItem} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
            <span>{item.name} × {item.quantity}</span>
            <span style={{ fontWeight: 600 }}>Rs. {item.price * item.quantity}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, marginTop: 10, borderTop: '1px solid var(--color-border)', fontWeight: 800, fontSize: 16 }}>
          <span>Total</span>
          <span>Rs. {total}</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="card" style={{ padding: 20 }}>
        <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: 16 }}>Delivery Address</h3>

        <div style={{ marginBottom: 14 }}>
          <label className="input-label">Street</label>
          <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} className="input-field" placeholder="House no, street name" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label className="input-label">City</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="input-field" placeholder="Karachi" />
          </div>
          <div>
            <label className="input-label">State</label>
            <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="input-field" placeholder="Sindh" />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label className="input-label">Zip Code</label>
          <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} className="input-field" placeholder="74000" />
        </div>

        <h3 style={{ marginBottom: 12, fontSize: 16 }}>Payment Method</h3>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          {[
            { value: 'cash', label: '💵 Cash on Delivery' },
            { value: 'card', label: '💳 Card' },
          ].map((opt) => (
            <label
              key={opt.value}
              style={{
                flex: 1,
                border: `2px solid ${paymentMethod === opt.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                background: paymentMethod === opt.value ? 'var(--color-primary-light)' : '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <input
                type="radio"
                name="payment"
                value={opt.value}
                checked={paymentMethod === opt.value}
                onChange={() => setPaymentMethod(opt.value)}
                style={{ display: 'none' }}
              />
              {opt.label}
            </label>
          ))}
        </div>

        {error && (
          <p style={{ color: 'var(--color-danger)', fontSize: 14, marginBottom: 12 }}>{error}</p>
        )}

        <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
          {submitting ? 'Placing Order...' : `Place Order — Rs. ${total}`}
        </button>
      </form>
    </div>
  );
};

export default Checkout;