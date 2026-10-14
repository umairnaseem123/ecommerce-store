import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { getRestaurantById } from '../../api/restaurantApi';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';

const Cart = () => {
  const { cart, loading, updateItem, removeItem, emptyCart } = useCart();
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState('');

  // The cart stores only the store id, so look up its name for display.
  const storeId = typeof cart?.restaurant === 'string' ? cart.restaurant : cart?.restaurant?._id;
  const populatedName = typeof cart?.restaurant === 'object' ? cart.restaurant?.name : '';

  useEffect(() => {
    if (populatedName) {
      setStoreName(populatedName);
      return;
    }
    if (!storeId) return;
    getRestaurantById(storeId)
      .then((d) => setStoreName(d.restaurant?.name || ''))
      .catch(() => setStoreName(''));
  }, [storeId, populatedName]);

  if (loading) return <Spinner label="Loading your cart..." />;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="theme-checkout">
        <div className="ds-container" style={{ maxWidth: 720, paddingBlock: 'var(--s-7)' }}>
          <EmptyState
            icon="🛒"
            title="Your cart is empty"
            subtitle="Looks like you haven't added anything yet."
            action={<Link to="/restaurants" className="ds-btn" style={{ marginTop: 16 }}>Browse stores</Link>}
          />
        </div>
      </div>
    );
  }

  const total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="theme-checkout fade-in">
      <div className="ds-container" style={{ paddingBlock: 'var(--s-7)' }}>
        <h1 style={{ fontSize: 'var(--fs-xl)' }}>Your cart</h1>
        <p className="ds-rcard__meta" style={{ margin: '6px 0 var(--s-5)' }}>
          Ordering from <strong style={{ color: 'var(--text)' }}>{storeName || 'your store'}</strong>
          {storeId && <> · <Link to={`/restaurant/${storeId}`} className="ds-link">Add more items</Link></>}
        </p>

        <div className="ds-cart">
          <div style={{ display: 'grid', gap: 'var(--s-3)' }}>
            {cart.items.map((item) => (
              <div key={item.menuItem} className="ds-card ds-cart__row">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>{item.name}</h4>
                  <p className="ds-rcard__meta" style={{ margin: '4px 0 0' }}>Rs. {item.price} each</p>
                </div>
                <div className="ds-qty">
                  <button aria-label="Decrease quantity" onClick={() => updateItem(item.menuItem, Math.max(1, item.quantity - 1))}>−</button>
                  <span>{item.quantity}</span>
                  <button aria-label="Increase quantity" onClick={() => updateItem(item.menuItem, item.quantity + 1)}>+</button>
                </div>
                <strong className="ds-cart__line">Rs. {item.price * item.quantity}</strong>
                <button className="ds-cart__remove" onClick={() => removeItem(item.menuItem)}>Remove</button>
              </div>
            ))}
          </div>

          <aside className="ds-card ds-card--pad ds-cart__summary">
            <h3 style={{ marginBottom: 'var(--s-4)' }}>Order summary</h3>
            <div className="ds-lines">
              <div className="ds-line"><span>Items ({count})</span><span>Rs. {total}</span></div>
              <div className="ds-line"><span>Delivery fee</span><span style={{ color: 'var(--green-500)', fontWeight: 700 }}>Free</span></div>
              <div className="ds-line ds-line--total"><span>Total</span><span>Rs. {total}</span></div>
            </div>
            <button onClick={() => navigate('/checkout')} className="ds-btn ds-btn--block" style={{ marginTop: 'var(--s-5)' }}>
              Proceed to checkout
            </button>
            <button onClick={emptyCart} className="ds-btn ds-btn--ghost ds-btn--block" style={{ marginTop: 'var(--s-3)' }}>
              Clear cart
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;
