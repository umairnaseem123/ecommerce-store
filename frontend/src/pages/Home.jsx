import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getRestaurants } from '../api/restaurantApi';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import StoreCard from '../components/StoreCard';

const Home = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [hero, setHero] = useState('');

  useEffect(() => {
    getRestaurants()
      .then((d) => setStores(d.restaurants || []))
     .catch((e) => { console.error('STORES ERROR:', e); setStores([]); })
      .finally(() => setLoading(false));
  }, []);

  // Optional banner photo: hero.jpg / hero.avif in public/images is used automatically.
  useEffect(() => {
    const names = ['hero.jpg', 'hero.avif'];
    const tryLoad = (i) => {
      if (i >= names.length) return;
      const im = new Image();
      im.onload = () => setHero(`/images/${names[i]}`);
      im.onerror = () => tryLoad(i + 1);
      im.src = `/images/${names[i]}`;
    };
    tryLoad(0);
  }, []);

  const cuisines = useMemo(() => [...new Set(stores.flatMap((s) => s.cuisine || []))], [stores]);

  if (authLoading) return <Spinner label="Loading..." />;
  if (user && user.role !== 'customer') return <Navigate to={`/${user.role}`} replace />;

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/restaurants?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div className="theme-home fade-in">
      <section className="ds-hero">
        <div className="ds-container ds-hero__in">
          <div>
            <h1>Hungry? Get your favourite food delivered fast.</h1>
            <p style={{ margin: '16px 0 28px', color: 'var(--ink-700)', fontSize: '1.1rem' }}>
              Browse stores, pick what you love, and order in a few clicks.
            </p>
            <form className="ds-search" onSubmit={onSearch}>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search stores or cuisines (e.g. Pizza, BBQ)" />
              <button className="ds-btn" type="submit">Find food</button>
            </form>
            <div className="ds-stats">
              <div><b>{stores.length}</b><span>Stores</span></div>
              <div><b>Free</b><span>Delivery</span></div>
              <div><b>Cash</b><span>or card</span></div>
            </div>
          </div>
          <img className="ds-hero__img" src={hero || '/images/pizza.avif'} alt="" />
        </div>
      </section>

      {cuisines.length > 0 && (
        <section className="ds-container ds-section" style={{ paddingBottom: 0 }}>
          <div className="ds-section-head"><h2>Browse by cuisine</h2></div>
          <div className="ds-chips">
            {cuisines.map((c) => (
              <Link key={c} to={`/restaurants?cuisine=${encodeURIComponent(c)}`} className="ds-chip">{c}</Link>
            ))}
          </div>
        </section>
      )}

      <section className="ds-container ds-section">
        <div className="ds-section-head">
          <h2>Popular stores</h2>
          <Link to="/restaurants" className="ds-link">View all</Link>
        </div>
        <div className="ds-grid">
          {loading
            ? [...Array(4)].map((_, i) => <div key={i} className="ds-skeleton ds-skeleton--card" />)
            : stores.slice(0, 4).map((s) => <StoreCard key={s._id} store={s} />)}
        </div>
      </section>

      <section className="ds-container" style={{ paddingBottom: 'var(--s-7)' }}>
        <div className="ds-promo">
          <div>
            <h2 style={{ color: '#fff' }}>Free delivery on every order</h2>
            <p style={{ margin: '8px 0 0' }}>Pick a store, fill your cart and we bring it to your door.</p>
          </div>
          <Link to="/restaurants" className="ds-btn">Order now</Link>
        </div>
      </section>

      <section className="ds-container ds-section" style={{ paddingTop: 0 }}>
        <div className="ds-section-head"><h2>How it works</h2></div>
        <div className="ds-grid">
          {[
            ['Pick a store', 'Browse stores and menus with photos and prices.'],
            ['Add to cart', 'Choose items, change quantities and review your total.'],
            ['Place your order', 'Checkout and track the status from My Orders.'],
          ].map(([t, d], i) => (
            <div key={t} className="ds-card ds-card--pad">
              <span className="ds-badge ds-badge--offer">{i + 1}</span>
              <h3 style={{ margin: '12px 0 6px' }}>{t}</h3>
              <p className="ds-rcard__meta" style={{ margin: 0 }}>{d}</p>
            </div>
          ))}
        </div>
        {!user && (
          <div style={{ textAlign: 'center', marginTop: 'var(--s-6)' }}>
            <Link to="/register" className="ds-btn">Create a free account</Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
