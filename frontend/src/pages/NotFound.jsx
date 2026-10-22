import { Link } from 'react-router-dom';
import '../styles/cart-chop.css';

const NotFound = () => (
  <div className="cc-page">
    <div className="cc-wrap">
      <div className="cc-card cc-empty">
        <div className="cc-empty__icon" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3M8.5 11h5" />
          </svg>
        </div>
        <h2>Page not found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="cc-btn cc-btn--auto">Back to home</Link>
      </div>
    </div>
  </div>
);

export default NotFound;
