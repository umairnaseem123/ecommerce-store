import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../api/orderApi';
import { validateCoupon } from '../../api/couponApi';
import Spinner from '../../components/Spinner';
import '../../styles/cart-chop.css';

const svg = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

const CashIcon = () => (
  <svg {...svg}><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 12h.01M18 12h.01" /></svg>
);
const CardIcon = () => (
  <svg {...svg}><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20M6 15h4" /></svg>
);
const CartIcon = () => (
  <svg {...svg} width="32" height="32"><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h3l2.6 11.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 7H6" /></svg>
);

const PAYMENTS = [
  { value: 'cash', label: 'Cash on delivery', hint: 'Pay when your order arrives', Icon: CashIcon },
  { value: 'card', label: 'Card', hint: 'Pay with your card', Icon: CardIcon },
];

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
  const [code, setCode] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState({ text: '', ok: false });
  const [applying, setApplying] = useState(false);

  if (loading) return <Spinner label="Loading checkout..." />;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cc-page">
        <div className="cc-wrap">
          <div className="cc-card cc-empty">
            <div className="cc-empty__icon"><CartIcon /></div>
            <h2>Your cart is empty</h2>
            <p>Add some items before checking out.</p>
            <Link to="/restaurants" className="cc-btn cc-btn--auto">Browse restaurants</Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = coupon ? Math.round((subtotal * coupon.percent) / 100) : 0;
  const total = subtotal - discount;

  const applyCoupon = async () => {
    if (!code.trim()) return;
    setApplying(true);
    setCouponMsg({ text: '', ok: false });
    try {
      const data = await validateCoupon(code);
      setCoupon(data.coupon);
      setCouponMsg({ text: `${data.coupon.code} applied: ${data.coupon.label}`, ok: true });
    } catch (err) {
      setCoupon(null);
      setCouponMsg({ text: err.response?.data?.message || 'Could not apply coupon', ok: false });
    } finally {
      setApplying(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!street || !city || !state || !zip) {
      setError('Please fill in all delivery address fields');
      return;
    }

    setSubmitting(true);
    try {
      const data = await createOrder({ deliveryAddress: { street, city, state, zip }, paymentMethod, couponCode: coupon?.code });
      await refreshCart();
      navigate(`/order-confirmation/${data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const field = (label, value, set, placeholder, id) => (
    <div>
      <label className="cc-label" htmlFor={id}>{label}</label>
      <input id={id} type="text" value={value} onChange={(e) => set(e.target.value)} className="cc-input" placeholder={placeholder} />
    </div>
  );

  return (
    <div className="cc-page">
      <div className="cc-wrap">
        <h1>Checkout</h1>
        <p className="cc-sub">Confirm your address and payment to place the order.</p>

        <div className="cc-layout">
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="cc-card cc-card--pad cc-form">
            <div className="cc-fields">
              <h3>Delivery address</h3>
              {field('Street', street, setStreet, 'House no, street name', 'co-street')}
              <div className="cc-two">
                {field('City', city, setCity, 'Karachi', 'co-city')}
                {field('State', state, setState, 'Sindh', 'co-state')}
              </div>
              {field('Zip code', zip, setZip, '74000', 'co-zip')}
            </div>

            <div className="cc-fields">
              <h3>Payment method</h3>
              <div className="cc-two">
                {PAYMENTS.map(({ value, label, hint, Icon }) => (
                  <label key={value} className={`cc-pay ${paymentMethod === value ? 'is-active' : ''}`}>
                    <input
                      className="cc-sr"
                      type="radio"
                      name="payment"
                      value={value}
                      checked={paymentMethod === value}
                      onChange={() => setPaymentMethod(value)}
                    />
                    <span className="cc-pay__icon"><Icon /></span>
                    <span><strong>{label}</strong><small>{hint}</small></span>
                  </label>
                ))}
              </div>
            </div>

            {error && <p className="cc-alert" role="alert">{error}</p>}
          </form>

          <aside className="cc-card cc-card--pad cc-summary">
            <h3>Order summary</h3>
            <div className="cc-lines">
              {cart.items.map((item) => (
                <div key={item.menuItem} className="cc-line cc-line--ink">
                  <span>{item.name} x {item.quantity}</span>
                  <span>Rs. {item.price * item.quantity}</span>
                </div>
              ))}
              <div className="cc-line"><span>Delivery fee</span><span className="cc-free">Free</span></div>
              {discount > 0 && (
                <div className="cc-line"><span>Discount ({coupon.code})</span><span className="cc-free">- Rs. {discount}</span></div>
              )}
              <div className="cc-line cc-line--total"><span>Total</span><span>Rs. {total}</span></div>
            </div>
            <div className="cc-coupon">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Coupon code"
                aria-label="Coupon code"
              />
              <button type="button" className="cc-btn cc-btn--ghost" onClick={applyCoupon} disabled={applying}>
                {applying ? '...' : 'Apply'}
              </button>
            </div>
            {couponMsg.text && <p className={`cc-coupon__msg ${couponMsg.ok ? 'is-ok' : 'is-bad'}`}>{couponMsg.text}</p>}
            <button type="submit" form="checkout-form" disabled={submitting} className="cc-btn">
              {submitting ? 'Placing order...' : `Place order - Rs. ${total}`}
            </button>
            <Link to="/cart" className="cc-link cc-back">Back to cart</Link>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
