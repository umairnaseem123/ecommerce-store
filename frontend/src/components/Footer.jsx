import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        padding: '20px 28px',
        textAlign: 'center',
        fontSize: 13,
        color: 'var(--color-text-muted)',
        background: '#fff',
      }}
    >
      © {new Date().getFullYear()} RestaurantOS — Built with ❤️ for great food.
    </footer>
  );
};

export default Footer;