import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getMenuByRestaurant } from '../../api/menuApi';
import { getRestaurantById } from '../../api/restaurantApi';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import SmartImage from '../../components/SmartImage';
import '../../styles/store.css';

const getFoodEmoji = (categoryName = '', itemName = '') => {
  const text = (categoryName + ' ' + itemName).toLowerCase();
  if (text.includes('drink') || text.includes('beverage') || text.includes('juice') || text.includes('shake')) return '🥤';
  if (text.includes('dessert') || text.includes('sweet') || text.includes('cake') || text.includes('ice cream')) return '🍰';
  if (text.includes('rice') || text.includes('biryani') || text.includes('pulao')) return '🍚';
  if (text.includes('kebab') || text.includes('bbq') || text.includes('grill')) return '🍢';
  if (text.includes('burger')) return '🍔';
  if (text.includes('pizza')) return '🍕';
  if (text.includes('soup')) return '🍲';
  if (text.includes('salad')) return '🥗';
  if (text.includes('bread') || text.includes('naan') || text.includes('roti')) return '🫓';
  if (text.includes('curry') || text.includes('karahi') || text.includes('gravy')) return '🍛';
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
    const fetchData = async () => {
      try {
        const [restaurantRes, menuRes] = await Promise.all([
          getRestaurantById(id),
          getMenuByRestaurant(id),
        ]);
        setRestaurant(restaurantRes.restaurant);
        setMenu(menuRes.menu || []);
      } catch (err) {
        setError('Failed to load this store. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
    ? `linear-gradient(rgba(28,25,23,.55), rgba(28,25,23,.78)), url(${restaurant.coverImage})`
    : 'linear-gradient(135deg, var(--color-primary) 0%, #fb923c 100%)';

  return (
    <div className="fade-in" style={{ position: 'relative' }}>
      <div className="store-banner" style={{ backgroundImage: banner, backgroundColor: 'var(--color-primary)' }}>
        <div className="store-banner-inner">
          <Link to="/restaurants" style={{ color: '#fff', fontSize: 13, opacity: 0.9, textDecoration: 'none' }}>
            ← Back to Stores
          </Link>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: '10px 0 4px' }}>{restaurant?.name}</h1>
          <p style={{ margin: 0, opacity: 0.95 }}>{restaurant?.description}</p>
          <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 13, flexWrap: 'wrap' }}>
            {restaurant?.rating > 0 && <span>{restaurant.rating} ★</span>}
            <span>{restaurant?.openingHours}</span>
            <span>{restaurant?.address?.city}</span>
            {restaurant?.cuisine?.length > 0 && <span>{restaurant.cuisine.join(', ')}</span>}
          </div>
        </div>
      </div>

      {menu.length > 0 && (
        <div className="filter-bar">
          <div className="filter-bar-inner">
            <input
              className="input-field"
              style={{ maxWidth: 240 }}
              placeholder="Search this menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="chips">
              <button className={`chip ${!activeCat ? 'active' : ''}`} onClick={() => setActiveCat('')}>All</button>
              {menu.map((c) => (
                <button
                  key={c._id}
                  className={`chip ${activeCat === c._id ? 'active' : ''}`}
                  onClick={() => setActiveCat(c._id)}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
              <input type="checkbox" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} style={{ width: 'auto' }} />
              Veg only
            </label>
          </div>
        </div>
      )}

      <div className="page-container">
        {menu.length === 0 && (
          <EmptyState icon="📋" title="Menu coming soon" subtitle="This store hasn't added any products yet." />
        )}

        {menu.length > 0 && visible.length === 0 && (
          <EmptyState icon="🔍" title="No items found" subtitle="Try a different search or category." />
        )}

        {visible.map((category) => (
          <div key={category._id} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 14 }}>{category.name}</h2>
            <div className="prod-grid">
              {category.items.map((item) => (
                <div key={item._id} className="card card-hover" style={{ overflow: 'hidden' }}>
                  <div style={{ position: 'relative' }}>
                    <SmartImage
                      src={item.image}
                      alt={item.name}
                      className="prod-img"
                      style={{ height: 170 }}
                      fallback={getFoodEmoji(category.name, item.name)}
                    />
                    <span
                      style={{
                        position: 'absolute', top: 10, left: 10, width: 16, height: 16, borderRadius: 4, background: '#fff',
                        border: `2px solid ${item.isVeg ? 'var(--color-success)' : 'var(--color-danger)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: item.isVeg ? 'var(--color-success)' : 'var(--color-danger)' }} />
                    </span>
                    {!item.isAvailable && (
                      <span style={{ position: 'absolute', top: 10, right: 10, background: 'var(--color-dark)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>
                        Sold Out
                      </span>
                    )}
                  </div>

                  <div style={{ padding: 16 }}>
                    <h4 style={{ margin: '0 0 4px', fontSize: 16 }}>{item.name}</h4>
                    <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--color-text-muted)', minHeight: 36 }}>
                      {item.description}
                    </p>
                    {item.tags?.length > 0 && (
                      <div style={{ marginBottom: 10 }}>
                        {item.tags.map((tag) => (
                          <span key={tag} className="tag" style={{ marginTop: 0 }}>{tag}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ margin: 0, fontWeight: 800, color: 'var(--color-primary-dark)', fontSize: 17 }}>
                        Rs. {item.price}
                      </p>
                      <button
                        onClick={() => handleAddToCart(item._id, item.name)}
                        disabled={addingId === item._id || !item.isAvailable}
                        className="btn btn-primary btn-sm"
                      >
                        {addingId === item._id ? 'Adding...' : '+ Add'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {toast && (
        <div
          className="fade-in"
          style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--color-dark)', color: '#fff', padding: '12px 20px',
            borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 600,
            boxShadow: 'var(--shadow-lg)', zIndex: 200,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
