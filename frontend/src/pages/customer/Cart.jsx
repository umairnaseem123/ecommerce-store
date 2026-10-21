import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { getRestaurantById } from '../../api/restaurantApi';
import Spinner from '../../components/Spinner';
import '../../styles/cart-chop.css';

const CartIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h3l2.6 11.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 7H6" />
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v5M14 11v5" />
  </svg>
);

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
      <div className="cc-page">
        <div className="cc-wrap">
          <div className="cc-card cc-empty">
            <div className="cc-empty__icon"><CartIcon /></div>
            <h2>Your cart is empty</h2>
            <p>Pick a restaurant and add your favourite dishes.</p>
            <Link to="/restaurants" className="cc-btn cc-btn--auto">Browse restaurants</Link>
          </div>
        </div>
      </div>
    );
  }

  const total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="cc-page">
      <div className="cc-wrap">
        <h1>Your cart</h1>
        <p className="cc-sub">
          Ordering from <strong>{storeName || 'your restaurant'}</strong>
          {storeId && <> | <Link to={`/restaurant/${storeId}`} className="cc-link">Add more items</Link></>}
        </p>

        <div className="cc-layout">
          <div className="cc-rows">
            {cart.items.map((item) => (
              <div key={item.menuItem} className="cc-card cc-row">
                <div className="cc-row__info">
                  <h4>{item.name}</h4>
                  <p>Rs. {item.price} each</p>
                </div>
                <div className="cc-qty">
                  <button type="button" aria-label="Decrease quantity" onClick={() => updateItem(item.menuItem, Math.max(1, item.quantity - 1))}>-</button>
                  <span>{item.quantity}</span>
                  <button type="button" aria-label="Increase quantity" onClick={() => updateItem(item.menuItem, item.quantity + 1)}>+</button>
                </div>
                <strong className="cc-row__total">Rs. {item.price * item.quantity}</strong>
                <button type="button" className="cc-remove" aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.menuItem)}>
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>

          <aside className="cc-card cc-card--pad cc-summary">
            <h3>Order summary</h3>
            <div className="cc-lines">
              <div className="cc-line"><span>Items ({count})</span><span>Rs. {total}</span></div>
              <div className="cc-line"><span>Delivery fee</span><span className="cc-free">Free</span></div>
              <div className="cc-line cc-line--total"><span>Total</span><span>Rs. {total}</span></div>
            </div>
            <button type="button" onClick={() => navigate('/checkout')} className="cc-btn">Proceed to checkout</button>
            <button type="button" onClick={emptyCart} className="cc-btn cc-btn--ghost">Clear cart</button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;
