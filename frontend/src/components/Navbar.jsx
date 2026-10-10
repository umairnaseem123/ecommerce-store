import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLink = {
    color: 'var(--color-text-muted)',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 600,
    padding: '6px 4px',
    borderBottom: '2px solid transparent',
    transition: 'color 0.15s ease',
  };

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 28px',
        borderBottom: '1px solid var(--color-border)',
        background: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <Link
          to="/"
          style={{
            color: 'var(--color-dark)',
            textDecoration: 'none',
            fontWeight: 800,
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          🍔 RestaurantOS
        </Link>

        {user.role === 'customer' && (
          <>
            <Link to="/restaurants" style={navLink}>Restaurants</Link>
            <Link to="/my-orders" style={navLink}>My Orders</Link>
          </>
        )}
        {user.role === 'manager' && (
  <>
    <Link to="/manager/orders" style={navLink}>Orders</Link>
    <Link to="/manager/menu" style={navLink}>Menu</Link>
  </>
)}
        {user.role === 'admin' && <Link to="/admin" style={navLink}>Admin Dashboard</Link>}
        {user.role === 'kitchen' && <Link to="/kitchen" style={navLink}>Kitchen</Link>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        {user.role === 'customer' && (
          <Link to="/cart" style={{ ...navLink, position: 'relative', display: 'flex', alignItems: 'center', gap: 4 }}>
            🛒 Cart
            {itemCount > 0 && (
              <span
                style={{
                  background: 'var(--color-primary)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 18,
                  height: 18,
                  fontSize: 11,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}
              >
                {itemCount}
              </span>
            )}
          </Link>
        )}

        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          {user.name?.[0]?.toUpperCase()}
        </div>

        <button onClick={handleLogout} className="btn btn-outline btn-sm">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;