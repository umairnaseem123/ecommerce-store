import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getRestaurants } from '../api/restaurantApi';
import { useAuth } from '../context/AuthContext';
import SmartImage from '../components/SmartImage';
import Spinner from '../components/Spinner';
import '../styles/store.css';
import '../styles/hero.css';

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
      .catch(() => setStores([]))
      .finally(() => setLoading(false));
  }, []);

  // Optional banner photo: put hero.jpg (or hero.avif) in public/images and it is used automatically.
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
    <div className="fade-in">
      <section
        className={`hero ${hero ? 'has-photo' : ''}`}
        style={hero ? { backgroundImage: `linear-gradient(90deg, rgba(14,52,36,.94) 0%, rgba(14,52,36,.78) 45%, rgba(14,52,36,.2) 100%), url(${hero})` } : undefined}
      >
        <div className="hero-inner">
          <div>
            <h1>Hungry? Get your <span>favourite food</span> delivered fast.</h1>
            <p>Browse stores, pick what you love, and order in a few clicks.</p>
            <form className="hero-search" onSubmit={onSearch}>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search stores or cuisines (e.g. Pizza, BBQ)"
              />
              <button className="btn btn-primary" type="submit">Search</button>
            </form>
            <div className="hero-stats">
              <div><b>{stores.length}</b>Stores</div>
              <div><b>Free</b>Delivery</div>
              <div><b>Cash</b>or card</div>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <img className="tall" src="/images/pizza.avif" alt="" />
            <img src="/images/icecream.avif" alt="" />
            <img src="/images/shake.avif" alt="" />
          </div>
        </div>
      </section>

      {cuisines.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>Browse by cuisine</h2></div>
          <div className="chips">
            {cuisines.map((c) => (
              <Link key={c} to={`/restaurants?cuisine=${encodeURIComponent(c)}`} className="chip">{c}</Link>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className="section-head">
          <h2>Popular stores</h2>
          <Link to="/restaurants">View all</Link>
        </div>
        {loading ? (
          <Spinner label="Loading stores..." />
        ) : (
          <div className="store-grid">
            {stores.slice(0, 4).map((s) => (
              <Link key={s._id} to={`/restaurant/${s._id}`} className="card card-hover store-card">
                <SmartImage src={s.coverImage} alt={s.name} className="store-cover" style={{ height: 170 }} fallback="🍽" />
                <div className="store-body">
                  <div className="store-title">
                    <h3>{s.name}</h3>
                    {s.rating > 0 && <span className="rating">{s.rating} ★</span>}
                  </div>
                  <p className="store-meta">{s.description}</p>
                  {s.cuisine?.map((c) => <span className="tag" key={c}>{c}</span>)}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="section" style={{ paddingBottom: 56 }}>
        <div className="section-head"><h2>How it works</h2></div>
        <div className="steps">
          <div className="card step"><div className="step-num">1</div><h4>Pick a store</h4><p>Browse stores and menus with photos and prices.</p></div>
          <div className="card step"><div className="step-num">2</div><h4>Add to cart</h4><p>Choose items, change quantities and review your total.</p></div>
          <div className="card step"><div className="step-num">3</div><h4>Place your order</h4><p>Checkout and track the status from My Orders.</p></div>
        </div>
        {!user && (
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <Link to="/register" className="btn btn-primary">Create a free account</Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
