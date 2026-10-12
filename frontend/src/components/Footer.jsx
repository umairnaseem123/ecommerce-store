import { useLocation } from 'react-router-dom';
import '../styles/layout.css';

const Footer = () => {
  const { pathname } = useLocation();
  if (pathname === '/login' || pathname === '/register') return null;
  return (
    <footer style={{ padding: '28px 20px', textAlign: 'center', fontSize: 13, color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', background: '#fff' }}>
      © {new Date().getFullYear()} FoodStore. Fresh food from local stores, delivered to your door.
    </footer>
  );
};

export default Footer;
