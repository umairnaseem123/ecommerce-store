import { Link } from 'react-router-dom';
import SmartImage from './SmartImage';

const StoreCard = ({ store: s }) => (
  <Link to={`/restaurant/${s._id}`} className="ds-card ds-rcard" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
    <div className="ds-rcard__media">
      <SmartImage src={s.coverImage} alt={s.name} fallback="🍽" style={{ height: '100%' }} />
      {s.rating > 0 && <span className="ds-badge ds-badge--rating ds-rcard__offer">{s.rating} ★</span>}
    </div>
    <div className="ds-rcard__body">
      <h3 style={{ fontSize: '1.05rem' }}>{s.name}</h3>
      <p className="ds-rcard__meta ds-clamp">{s.description}</p>
      <div>{s.cuisine?.map((c) => <span className="tag" key={c}>{c}</span>)}</div>
      {s.openingHours && <p className="ds-rcard__meta" style={{ margin: 0 }}>{s.openingHours}</p>}
    </div>
  </Link>
);

export default StoreCard;
