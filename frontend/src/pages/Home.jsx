import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getRestaurants } from '../api/restaurantApi';
import { useAuth } from '../context/AuthContext';
import '../styles/home-chop.css';

// Cuisine -> photo (all of these already exist in public/images)
const CUISINE_IMG = {
  'Fast Food': 'burger.avif',
  American: 'fries.avif',
  Italian: 'pasta.avif',
  Pizza: 'pizza.avif',
  Pakistani: 'biryani.jpg',
  BBQ: 'kebab.avif',
  Desserts: 'cake.avif',
  Beverages: 'juice.avif',
};

const ROLE_HOME = { manager: '/manager', admin: '/admin', kitchen: '/kitchen' };

const Star = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="m12 2.5 2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9z" />
  </svg>
);

const Pin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

const Home = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [favs, setFavs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fav-restaurants')) || []; } catch { return []; }
  });
  const toggleFav = (id) => setFavs((cur) => {
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    try { localStorage.setItem('fav-restaurants', JSON.stringify(next)); } catch { /* storage unavailable */ }
    return next;
  });

  useEffect(() => {
    getRestaurants()
      .then((d) => setStores(d.restaurants || []))
      .catch((e) => { console.error('STORES ERROR:', e); setStores([]); })
      .finally(() => setLoading(false));
  }, []);

  const cuisines = useMemo(() => {
    const set = new Set();
    stores.forEach((s) => (s.cuisine || []).forEach((c) => set.add(c)));
    return [...set];
  }, [stores]);

  const avg = useMemo(() => {
    const rated = stores.filter((s) => s.rating);
    if (!rated.length) return null;
    return (rated.reduce((a, s) => a + s.rating, 0) / rated.length).toFixed(1);
  }, [stores]);

  if (!authLoading && user && ROLE_HOME[user.role]) {
    return <Navigate to={ROLE_HOME[user.role]} replace />;
  }

  const go = (term) => navigate(term ? `/restaurants?q=${encodeURIComponent(term)}` : '/restaurants');
  const onSubmit = (e) => { e.preventDefault(); go(q.trim()); };

  return (
    <div className="cd-home">
      {/* HERO */}
      <section className="cd-hero">
        <div className="cd-wrap cd-hero__in">
          <div className="cd-hero__text">
            <span className="cd-pill">Fast delivery · Best prices</span>
            <h1>
              Delicious food,<br />delivered <span className="cd-accent">fast</span>
            </h1>
            <p>Order from your favourite restaurants near you.</p>

            <form className="cd-search" onSubmit={onSubmit}>
              <span className="cd-search__pin"><Pin /></span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search restaurants or cuisines (e.g. Pizza, BBQ)"
                aria-label="Search restaurants or cuisines"
              />
              <button type="submit" className="cd-btn">Find food</button>
            </form>

            <ul className="cd-facts">
              <li><strong>{loading ? '–' : stores.length}</strong> restaurants</li>
              <li><strong>Free</strong> delivery</li>
              <li><strong>Cash</strong> or card</li>
            </ul>
          </div>

          <div className="cd-hero__art">
            <div className="cd-hero__blob" />
            <img src="/images/burger.jpg" alt="Juicy burger" />
            <div className="cd-float cd-float--top">
              <b>Free</b>
              <span>Delivery on every order</span>
            </div>
            {avg && (
              <div className="cd-float cd-float--bottom">
                <span className="cd-float__star"><Star size={22} /></span>
                <div><b>{avg}</b><span>Avg. rating</span></div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      {cuisines.length > 0 && (
        <section className="cd-section">
          <div className="cd-wrap">
            <div className="cd-head">
              <h2>Explore categories</h2>
              <Link to="/restaurants" className="cd-link">View all</Link>
            </div>
            <div className="cd-cats">
              {cuisines.map((c) => (
                <button key={c} type="button" className="cd-cat" onClick={() => go(c)}>
                  <img src={`/images/${CUISINE_IMG[c] || 'burger.avif'}`} alt="" loading="lazy" />
                  <span>{c}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAVOURITES */}
      {!loading && stores.some((s) => favs.includes(s._id)) && (
        <section className="cd-section">
          <div className="cd-wrap">
            <div className="cd-head"><h2>Your favourites</h2></div>
            <div className="cd-cats">
              {stores.filter((s) => favs.includes(s._id)).map((s) => (
                <Link key={s._id} to={`/restaurant/${s._id}`} className="cd-cat cd-cat--fav">
                  <img src={s.coverImage || '/images/hero.jpg'} alt="" loading="lazy" onError={(e) => { e.currentTarget.src = '/images/hero.jpg'; }} />
                  <span>{s.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* POPULAR RESTAURANTS */}
      <section className="cd-section">
        <div className="cd-wrap">
          <div className="cd-head">
            <h2>Popular restaurants</h2>
            <Link to="/restaurants" className="cd-link">View all</Link>
          </div>

          <div className="cd-grid">
            {loading && [0, 1, 2, 3].map((i) => <div key={i} className="cd-card cd-skel" />)}

            {!loading && stores.length === 0 && (
              <p className="cd-empty">No restaurants yet. Check back soon.</p>
            )}

            {!loading && stores.map((s) => (
              <article key={s._id} className="cd-card">
                <button
                  type="button"
                  className={`cd-heart ${favs.includes(s._id) ? 'is-on' : ''}`}
                  onClick={() => toggleFav(s._id)}
                  aria-pressed={favs.includes(s._id)}
                  aria-label={favs.includes(s._id) ? `Remove ${s.name} from favourites` : `Add ${s.name} to favourites`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={favs.includes(s._id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
                  </svg>
                </button>
                <Link to={`/restaurant/${s._id}`} className="cd-card__img" tabIndex={-1} aria-hidden="true">
                  <img
                    src={s.coverImage || '/images/hero.jpg'}
                    alt=""
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = '/images/hero.jpg'; }}
                  />
                  {s.rating ? (
                    <span className="cd-rate"><Star size={12} /> {Number(s.rating).toFixed(1)}</span>
                  ) : null}
                </Link>
                <div className="cd-card__body">
                  <h3>{s.name}</h3>
                  <p className="cd-card__meta">{(s.cuisine || []).join(', ')}</p>
                  {s.openingHours && <p className="cd-card__hours">{s.openingHours}</p>}
                  <Link to={`/restaurant/${s._id}`} className="cd-btn cd-btn--block">Order now</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* OFFER BANNER */}
      <section className="cd-section">
        <div className="cd-wrap">
          <div className="cd-offer">
            <div>
              <h2>Free delivery on every order</h2>
              <p>Pay by cash or card when your food arrives.</p>
            </div>
            <Link to="/restaurants" className="cd-btn cd-btn--light">Order now</Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="cd-section cd-section--last">
        <div className="cd-wrap">
          <div className="cd-head"><h2>How it works</h2></div>
          <ol className="cd-steps">
            <li><span>1</span><h3>Pick a restaurant</h3><p>Browse by cuisine or search by name.</p></li>
            <li><span>2</span><h3>Add to cart</h3><p>Choose your dishes and review your order.</p></li>
            <li><span>3</span><h3>Place your order</h3><p>Confirm your address and we deliver it.</p></li>
          </ol>
        </div>
      </section>
    </div>
  );
};

export default Home;
