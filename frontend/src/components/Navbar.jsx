import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/store.css';
import '../styles/navbar.css';

const icon = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

const CartIcon = () => (
  <svg {...icon}><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h3l2.6 11.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 7H6" /></svg>
);
const ChevronIcon = () => (
  <svg {...icon} width="16" height="16"><path d="m6 9 6 6 6-6" /></svg>
);
const OrdersIcon = () => (
  <svg {...icon} width="18" height="18"><path d="M21 8 12 3 3 8v8l9 5 9-5z" /><path d="m3 8 9 5 9-5M12 13v8" /></svg>
);
const LogoutIcon = () => (
  <svg {...icon} width="18" height="18"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
);

const linksFor = (role) => {
  if (role === 'manager') return [['/manager', 'Dashboard', true], ['/manager/orders', 'Orders'], ['/manager/menu', 'Products']];
  if (role === 'admin') return [['/admin', 'Admin Dashboard']];
  if (role === 'kitchen') return [['/kitchen', 'Kitchen']];
  const base = [['/', 'Home', true], ['/restaurants', 'Stores']];
  return role === 'customer' ? [...base, ['/my-orders', 'My Orders']] : base;
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setOpen(false);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  if (location.pathname === '/login' || location.pathname === '/register') return null;

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate('/');
  };

  const firstName = user?.name?.split(' ')[0] || '';

  return (
    <header className={`nb ${scrolled ? 'nb-scrolled' : ''}`}>
      <div className="nb-inner">
        <Link to="/" className="nb-brand">
          <span className="nb-mark">F</span>
          <span>FoodStore</span>
        </Link>

        <nav className={`nb-links ${open ? 'open' : ''}`} aria-label="Main">
          {linksFor(user?.role).map(([to, label, end]) => (
            <NavLink key={to} to={to} end={!!end} className={({ isActive }) => `nb-link ${isActive ? 'active' : ''}`}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="nb-actions">
          {user?.role === 'customer' && (
            <Link to="/cart" className="nb-cart" aria-label={`Cart, ${itemCount} items`}>
              <CartIcon />
              {itemCount > 0 && <span className="nb-badge">{itemCount}</span>}
            </Link>
          )}

          {user ? (
            <div className="nb-user" ref={menuRef}>
              <button
                className="nb-user-btn"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                <span className="nb-avatar">{user.name?.[0]?.toUpperCase()}</span>
                <span className="nb-user-name">{firstName}</span>
                <ChevronIcon />
              </button>
              {menuOpen && (
                <div className="nb-menu" role="menu">
                  <div className="nb-menu-head">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                    <em>{user.role}</em>
                  </div>
                  {user.role === 'customer' && (
                    <Link to="/my-orders" className="nb-menu-item" role="menuitem"><OrdersIcon /> My orders</Link>
                  )}
                  <button onClick={handleLogout} className="nb-menu-item nb-danger" role="menuitem"><LogoutIcon /> Log out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm nb-login">Log in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign up</Link>
            </>
          )}

          <button className="nb-toggle" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            <svg {...icon}>{open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}</svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
