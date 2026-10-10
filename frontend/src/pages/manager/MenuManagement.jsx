import { useEffect, useState } from 'react';
import { getMyRestaurants } from '../../api/restaurantApi';
import {
  getMenuByRestaurant,
  createCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../../api/menuApi';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';

const emptyItemForm = {
  name: '',
  description: '',
  price: '',
  image: '',
  isVeg: false,
  category: '',
};

const MenuManagement = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newCategory, setNewCategory] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  const [itemForm, setItemForm] = useState(emptyItemForm);
  const [addingItem, setAddingItem] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);

  const loadMenu = async (restaurantId) => {
    const data = await getMenuByRestaurant(restaurantId);
    setMenu(data.menu);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const resData = await getMyRestaurants();
        if (resData.restaurants.length === 0) {
          setError('No restaurant found for this manager account');
          setLoading(false);
          return;
        }
        const myRestaurant = resData.restaurants[0];
        setRestaurant(myRestaurant);
        await loadMenu(myRestaurant._id);
      } catch (err) {
        setError('Failed to load menu');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setAddingCategory(true);
    try {
      await createCategory(restaurant._id, newCategory.trim(), menu.length);
      setNewCategory('');
      await loadMenu(restaurant._id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add category');
    } finally {
      setAddingCategory(false);
    }
  };

  const openItemForm = (categoryId) => {
    setItemForm({ ...emptyItemForm, category: categoryId });
    setShowItemForm(true);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!itemForm.name || !itemForm.price || !itemForm.category) {
      alert('Name, price, and category are required');
      return;
    }
    setAddingItem(true);
    try {
      await createMenuItem({
        restaurant: restaurant._id,
        category: itemForm.category,
        name: itemForm.name,
        description: itemForm.description,
        price: Number(itemForm.price),
        image: itemForm.image,
        isVeg: itemForm.isVeg,
      });
      setItemForm(emptyItemForm);
      setShowItemForm(false);
      await loadMenu(restaurant._id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add item');
    } finally {
      setAddingItem(false);
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      await updateMenuItem(item._id, { isAvailable: !item.isAvailable });
      await loadMenu(restaurant._id);
    } catch (err) {
      alert('Failed to update item');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await deleteMenuItem(itemId);
      await loadMenu(restaurant._id);
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  if (loading) return <Spinner label="Loading menu..." />;
  if (error) return <div className="page-container"><EmptyState icon="⚠️" title="Error" subtitle={error} /></div>;

  return (
    <div className="page-container fade-in">
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>{restaurant.name} — Menu</h1>
      <p style={{ color: 'var(--color-text-muted)', marginTop: 0, marginBottom: 24 }}>
        Add categories and items to your menu
      </p>

      {/* Add category form */}
      <form onSubmit={handleAddCategory} className="card" style={{ padding: 16, marginBottom: 24, display: 'flex', gap: 10 }}>
        <input
          type="text"
          placeholder="New category name (e.g. Desserts)"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="input-field"
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={addingCategory} className="btn btn-primary">
          {addingCategory ? 'Adding...' : '+ Add Category'}
        </button>
      </form>

      {menu.length === 0 && (
        <EmptyState icon="📋" title="No categories yet" subtitle="Add your first category above to get started." />
      )}

      {menu.map((category) => (
        <div key={category._id} style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '2px solid var(--color-primary-light)', paddingBottom: 8 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{category.name}</h2>
            <button onClick={() => openItemForm(category._id)} className="btn btn-outline btn-sm">
              + Add Item
            </button>
          </div>

          {category.items.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>No items yet.</p>
          ) : (
            <div className="grid-cards">
              {category.items.map((item) => (
                <div key={item._id} className="card" style={{ overflow: 'hidden' }}>
                  <div
                    style={{
                      height: 110,
                      background: item.image
                        ? `url(${item.image}) center/cover no-repeat`
                        : 'linear-gradient(135deg, var(--color-primary-light), #fed7aa)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 36,
                    }}
                  >
                    {!item.image && '🍽️'}
                  </div>
                  <div style={{ padding: 14 }}>
                    <h4 style={{ margin: '0 0 4px', fontSize: 14 }}>{item.name}</h4>
                    <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                      Rs. {item.price}
                    </p>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => handleToggleAvailability(item)}
                        className={item.isAvailable ? 'btn btn-outline btn-sm' : 'btn btn-primary btn-sm'}
                        style={{ flex: 1 }}
                      >
                        {item.isAvailable ? 'Mark Sold Out' : 'Mark Available'}
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="btn btn-danger-outline btn-sm"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Add item modal */}
      {showItemForm && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300,
          }}
          onClick={() => setShowItemForm(false)}
        >
          <form
            onSubmit={handleAddItem}
            onClick={(e) => e.stopPropagation()}
            className="card fade-in"
            style={{ padding: 24, width: '90%', maxWidth: 420 }}
          >
            <h3 style={{ marginTop: 0 }}>Add Menu Item</h3>

            <label className="input-label">Name</label>
            <input
              type="text"
              className="input-field"
              style={{ marginBottom: 12 }}
              value={itemForm.name}
              onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
            />

            <label className="input-label">Description</label>
            <input
              type="text"
              className="input-field"
              style={{ marginBottom: 12 }}
              value={itemForm.description}
              onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
            />

            <label className="input-label">Price (Rs.)</label>
            <input
              type="number"
              className="input-field"
              style={{ marginBottom: 12 }}
              value={itemForm.price}
              onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
            />

            <label className="input-label">Image URL (optional)</label>
            <input
              type="text"
              className="input-field"
              style={{ marginBottom: 12 }}
              placeholder="https://..."
              value={itemForm.image}
              onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
            />

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 14 }}>
              <input
                type="checkbox"
                checked={itemForm.isVeg}
                onChange={(e) => setItemForm({ ...itemForm, isVeg: e.target.checked })}
              />
              Vegetarian
            </label>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={() => setShowItemForm(false)} className="btn btn-outline" style={{ flex: 1 }}>
                Cancel
              </button>
              <button type="submit" disabled={addingItem} className="btn btn-primary" style={{ flex: 1 }}>
                {addingItem ? 'Adding...' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;