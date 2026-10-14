import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getMenuByRestaurant } from '../../api/menuApi';
import { getRestaurantById } from '../../api/restaurantApi';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import SmartImage from '../../components/SmartImage';

const getFoodEmoji = (categoryName = '', itemName = '') => {
  const text = (categoryName + ' ' + itemName).toLowerCase();
  if (/drink|beverage|juice|shake/.test(text)) return '🥤';
  if (/dessert|sweet|cake|ice cream/.test(text)) return '🍰';
  if (/rice|biryani|pulao/.test(text)) return '🍚';
  if (/kebab|bbq|grill/.test(text)) return '🍢';
  if (text.includes('burger')) return '🍔';
  if (text.includes('pizza')) return '🍕';
  if (text.includes('soup')) return '🍲';
  if (text.includes('salad')) return '🥗';
  if (/bread|naan|roti/.test(text)) return '🫓';
  if (/curry|karahi|gravy/.test(text)) return '🍛';
  return '🍽';
};

const RestaurantMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingId, setAddingId] = useState(null);
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [restaurantRes, menuRes] = await Promise.all([getRestaurantById(id), getMenuByRestaurant(id)]);
        setRestaurant(restaurantRes.restaurant);
        setMenu(menuRes.menu || []);
      } catch (err) {
        setError('Failed to load this store. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return menu
      .filter((c) => !activeCat || c._id === activeCat)
      .map((c) => ({
        ...c,
        items: c.items.filter(
          (i) =>
            (!q || i.name.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q)) &&
            (!vegOnly || i.isVeg)
        ),
      }))
      .filter((c) => c.items.length > 0);
  }, [menu, search, activeCat, vegOnly]);

  const handleAddToCart = async (itemId, itemName) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAddingId(itemId);
    try {
      await addItem(itemId, 1);
      setToast(`${itemName} added to cart`);
    } catch (err) {
      setToast(err.response?.data?.message || 'Could not add this item');
    } finally {
      setAddingId(null);
      setTimeout(() => setToast(''), 2200);
    }
  };

  if (loading) return <Spinner label="Loading menu..." />;
  if (error) return <div className="page-container"><EmptyState icon="⚠️" title="Error" subtitle={error} /></div>;

  const banner = restaurant?.coverImage
    ? `linear-gradient(rgba(29,27,25,.45), rgba(29,27,25,.8)), url(${restaurant.coverImage})`
    : 'linear-gradient(135deg, var(--orange-500), var(--yellow-400))';

  return (
    <div className="theme-menu fade-in">
      <div className="ds-banner" style={{ backgroundImage: banner }}>
        <div className="ds-container" style={{ paddingBlock: 'var(--s-7)' }}>
          <Link to="/restaurants" className="ds-back">← Back to stores</Link>
          <h1 style={{ fontSize: 'var(--fs-xl)', margin: '10px 0 6px' }}>{restaurant?.name}</h1>
          <p style={{ margin: 0, opacity: 0.92 }}>{restaurant?.description}</p>
          <div className="ds-banner__meta">
            {restaurant?.rating > 0 && <span className="ds-badge ds-badge--rating">{restaurant.rating} ★</span>}
            {restaurant?.openingHours && <span>{restaurant.openingHours}</span>}
            {restaurant?.address?.city && <span>{restaurant.address.city}</span>}
            {restaurant?.cuisine?.length > 0 && <span>{restaurant.cuisine.join(', ')}</span>}
          </div>
        </div>
      </div>

      {menu.length > 0 && (
        <div className="ds-filterbar">
          <div className="ds-container ds-filterbar__in">
            <input className="ds-input" style={{ maxWidth: 240 }} placeholder="Search this menu..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="ds-chips" style={{ flex: 1 }}>
              <button className={`ds-chip ${!activeCat ? 'is-active' : ''}`} onClick={() => setActiveCat('')}>All</button>
              {menu.map((c) => (
                <button key={c._id} className={`ds-chip ${activeCat === c._id ? 'is-active' : ''}`} onClick={() => setActiveCat(c._id)}>{c.name}</button>
              ))}
            </div>
            <label className="ds-check">
              <input type="checkbox" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} /> Veg only
            </label>
          </div>
        </div>
      )}

      <div className="ds-container" style={{ paddingBlock: 'var(--s-6) var(--s-8)' }}>
        {menu.length === 0 && <EmptyState icon="📋" title="Menu coming soon" subtitle="This store hasn't added any products yet." />}
        {menu.length > 0 && visible.length === 0 && <EmptyState icon="🔍" title="No items found" subtitle="Try a different search or category." />}

        {visible.map((category) => (
          <section key={category._id} style={{ marginBottom: 'var(--s-7)' }}>
            <h2 style={{ fontSize: 'var(--fs-lg)', marginBottom: 'var(--s-4)' }}>{category.name}</h2>
            <div className="ds-menu-grid">
              {category.items.map((item) => (
                <article key={item._id} className="ds-card ds-dish">
                  <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={`ds-veg ${item.isVeg ? 'is-veg' : 'is-nonveg'}`} title={item.isVeg ? 'Vegetarian' : 'Non-vegetarian'} />
                      <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{item.name}</h4>
                    </div>
                    <p className="ds-rcard__meta ds-clamp" style={{ margin: 0 }}>{item.description}</p>
                    {item.tags?.length > 0 && (
                      <div className="ds-dish__tags">{item.tags.map((t) => <span key={t} className="tag" style={{ margin: 0 }}>{t}</span>)}</div>
                    )}
                    <div className="ds-rcard__row" style={{ marginTop: 4 }}>
                      <span className="ds-dish__price">Rs. {item.price}</span>
                      <button
                        className="ds-btn"
                        onClick={() => handleAddToCart(item._id, item.name)}
                        disabled={addingId === item._id || !item.isAvailable}
                      >
                        {!item.isAvailable ? 'Sold out' : addingId === item._id ? 'Adding...' : '+ Add'}
                      </button>
                    </div>
                  </div>
                  <SmartImage src={item.image} alt={item.name} className="ds-dish__img" fallback={getFoodEmoji(category.name, item.name)} />
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      {toast && (
        <div className="ds-toast-wrap" role="status">
          <div className="ds-toast ds-toast--success">{toast}</div>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
