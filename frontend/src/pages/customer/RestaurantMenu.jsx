import { useCart } from '../../context/CartContext';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMenuByRestaurant } from '../../api/menuApi';
import { getRestaurantById } from '../../api/restaurantApi';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';

// Category ke hisaab se food emoji chunne ke liye
const getFoodEmoji = (categoryName = '', itemName = '') => {
  const text = (categoryName + ' ' + itemName).toLowerCase();
  if (text.includes('drink') || text.includes('beverage') || text.includes('juice')) return '🥤';
  if (text.includes('dessert') || text.includes('sweet') || text.includes('cake')) return '🍰';
  if (text.includes('rice') || text.includes('biryani') || text.includes('pulao')) return '🍚';
  if (text.includes('kebab') || text.includes('bbq') || text.includes('grill')) return '🍢';
  if (text.includes('burger')) return '🍔';
  if (text.includes('pizza')) return '🍕';
  if (text.includes('soup')) return '🍲';
  if (text.includes('salad')) return '🥗';
  if (text.includes('bread') || text.includes('naan') || text.includes('roti')) return '🫓';
  if (text.includes('starter') || text.includes('appetizer')) return '🍤';
  if (text.includes('curry') || text.includes('karahi') || text.includes('gravy')) return '🍛';
  return '🍽️';
};

const RestaurantMenu = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { addItem } = useCart();
  const [addingId, setAddingId] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantRes, menuRes] = await Promise.all([
          getRestaurantById(id),
          getMenuByRestaurant(id),
        ]);
        setRestaurant(restaurantRes.restaurant);
        setMenu(menuRes.menu);
      } catch (err) {
        setError('Failed to load menu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = async (itemId, itemName) => {
    setAddingId(itemId);
    try {
      await addItem(itemId, 1);
      setToast(`${itemName} added to cart!`);
    } catch (err) {
      setToast(err.response?.data?.message || 'Failed to add item');
    } finally {
      setAddingId(null);
      setTimeout(() => setToast(''), 2200);
    }
  };

  if (loading) return <Spinner label="Loading menu..." />;
  if (error) return <div className="page-container"><EmptyState icon="⚠️" title="Error" subtitle={error} /></div>;

  return (
    <div className="fade-in" style={{ position: 'relative' }}>
      {/* Restaurant header banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, #fb923c 100%)',
          color: '#fff',
          padding: '40px 20px',
        }}
      >
        <div className="page-container" style={{ padding: 0 }}>
          <Link to="/restaurants" style={{ color: '#fff', fontSize: 13, opacity: 0.9, textDecoration: 'none' }}>
            ← Back to Restaurants
          </Link>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: '10px 0 4px' }}>{restaurant?.name}</h1>
          <p style={{ margin: 0, opacity: 0.95 }}>{restaurant?.description}</p>
          <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 13, flexWrap: 'wrap' }}>
            <span>🕐 {restaurant?.openingHours}</span>
            <span>📍 {restaurant?.address?.city}</span>
            {restaurant?.cuisine?.length > 0 && <span>🍽️ {restaurant.cuisine.join(', ')}</span>}
          </div>
        </div>
      </div>

      <div className="page-container">
        {menu.length === 0 && (
          <EmptyState icon="📋" title="Menu coming soon" subtitle="This restaurant hasn't added any items yet." />
        )}

        {menu.map((category) => (
          <div key={category._id} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 19, fontWeight: 800, marginBottom: 14, borderBottom: '2px solid var(--color-primary-light)', paddingBottom: 8 }}>
              {category.name}
            </h2>
            {category.items.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>No items in this category yet.</p>
            ) : (
              <div className="grid-cards">
                {category.items.map((item) => (
                  <div key={item._id} className="card card-hover" style={{ overflow: 'hidden' }}>
                    {/* Item image / placeholder */}
                    <div
                      style={{
                        height: 140,
                        background: item.image
                          ? `url(${item.image}) center/cover no-repeat`
                          : 'linear-gradient(135deg, var(--color-primary-light), #fed7aa)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 44,
                        position: 'relative',
                      }}
                    >
                      {!item.image && getFoodEmoji(category.name, item.name)}

                      {/* Veg/Non-veg indicator */}
                      <span
                        style={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          width: 16,
                          height: 16,
                          border: `2px solid ${item.isVeg ? 'var(--color-success)' : 'var(--color-danger)'}`,
                          borderRadius: 4,
                          background: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: item.isVeg ? 'var(--color-success)' : 'var(--color-danger)',
                          }}
                        />
                      </span>

                      {!item.isAvailable && (
                        <span
                          style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            background: 'var(--color-dark)',
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 6,
                          }}
                        >
                          Sold Out
                        </span>
                      )}
                    </div>

                    <div style={{ padding: 16 }}>
                      <h4 style={{ margin: '0 0 4px', fontSize: 15 }}>{item.name}</h4>
                      <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--color-text-muted)', minHeight: 34 }}>
                        {item.description}
                      </p>

                      {item.tags?.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              style={{
                                fontSize: 10,
                                background: 'var(--color-bg)',
                                color: 'var(--color-text-muted)',
                                padding: '2px 8px',
                                borderRadius: 999,
                                fontWeight: 600,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ margin: 0, fontWeight: 800, color: 'var(--color-primary-dark)', fontSize: 16 }}>
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
            )}
          </div>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--color-dark)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            fontSize: 14,
            fontWeight: 600,
            boxShadow: 'var(--shadow-lg)',
            zIndex: 200,
          }}
          className="fade-in"
        >
          {toast}
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;