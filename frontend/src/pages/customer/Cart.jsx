import { useCart } from '../../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';

const Cart = () => {
  const { cart, loading, updateItem, removeItem, emptyCart } = useCart();
  const navigate = useNavigate();

  if (loading) return <Spinner label="Loading your cart..." />;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="page-container-narrow">
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          subtitle="Looks like you haven't added anything yet."
          action={
            <Link to="/restaurants" className="btn btn-primary" style={{ marginTop: 16 }}>
              Browse Restaurants
            </Link>
          }
        />
      </div>
    );
  }

  const total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = 0;

  return (
    <div className="page-container-narrow fade-in">
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Your Cart</h1>
      <p style={{ color: 'var(--color-text-muted)', marginTop: 0, marginBottom: 24 }}>
        📍 Ordering from <strong>{cart.restaurant?.name || cart.restaurant}</strong>
      </p>

      <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
        {cart.items.map((item) => (
          <div
            key={item.menuItem}
            className="card"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 16,
              gap: 12,
            }}
          >
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: 15 }}>{item.name}</h4>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--color-text-muted)' }}>
                Rs. {item.price} each
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => updateItem(item.menuItem, Math.max(1, item.quantity - 1))}
                style={{
                  width: 28, height: 28, borderRadius: 6, border: '1px solid var(--color-border)',
                  background: '#fff', cursor: 'pointer', fontWeight: 700,
                }}
              >
                −
              </button>
              <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 700 }}>{item.quantity}</span>
              <button
                onClick={() => updateItem(item.menuItem, item.quantity + 1)}
                style={{
                  width: 28, height: 28, borderRadius: 6, border: '1px solid var(--color-border)',
                  background: '#fff', cursor: 'pointer', fontWeight: 700,
                }}
              >
                +
              </button>
            </div>

            <p style={{ width: 70, textAlign: 'right', fontWeight: 700, margin: 0 }}>
              Rs. {item.price * item.quantity}
            </p>

            <button
              onClick={() => removeItem(item.menuItem)}
              style={{
                background: 'none', border: 'none', color: 'var(--color-danger)',
                cursor: 'pointer', fontSize: 13, fontWeight: 600,
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: 'var(--color-text-muted)' }}>
          <span>Subtotal</span>
          <span>Rs. {total}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14, color: 'var(--color-text-muted)' }}>
          <span>Delivery Fee</span>
          <span>Free</span>
        </div>
        <div
          style={{
            display: 'flex', justifyContent: 'space-between', paddingTop: 12,
            borderTop: '1px solid var(--color-border)', fontSize: 18, fontWeight: 800,
          }}
        >
          <span>Total</span>
          <span>Rs. {total + deliveryFee}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <button onClick={emptyCart} className="btn btn-outline" style={{ flex: 1 }}>
          Clear Cart
        </button>
        <button onClick={() => navigate('/checkout')} className="btn btn-primary" style={{ flex: 2 }}>
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
};

export default Cart;