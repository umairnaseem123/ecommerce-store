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
import SmartImage from '../../components/SmartImage';
import '../../styles/store.css';

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
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState('');

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  const loadMenu = async (restaurantId) => {
    const data = await getMenuByRestaurant(restaurantId);
    setMenu(data.menu || []);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const resData = await getMyRestaurants();
        if (resData.restaurants.length === 0) {
          setError('No store found for this manager account');
          setLoading(false);
          return;
        }
        const myRestaurant = resData.restaurants[0];
        setRestaurant(myRestaurant);
        await loadMenu(myRestaurant._id);
      } catch (err) {
        setError('Failed to load products. Please try again.');
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
      notify('Category added');
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to add category');
    } finally {
      setAddingCategory(false);
    }
  };

  const openAdd = (categoryId) => {
    setEditingId(null);
    setFormError('');
    setItemForm({ ...emptyItemForm, category: categoryId });
    setShowItemForm(true);
  };

  const openEdit = (item, categoryId) => {
    setEditingId(item._id);
    setFormError('');
    setItemForm({
      name: item.name,
      description: item.description || '',
      price: item.price,
      image: item.image || '',
      isVeg: !!item.isVeg,
      category: categoryId,
    });
    setShowItemForm(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!itemForm.name.trim() || !itemForm.price || Number(itemForm.price) <= 0) {
      setFormError('Name and a price greater than 0 are required');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const payload = {
        name: itemForm.name.trim(),
        description: itemForm.description,
        price: Number(itemForm.price),
        image: itemForm.image,
        isVeg: itemForm.isVeg,
      };
      if (editingId) {
        await updateMenuItem(editingId, payload);
      } else {
        await createMenuItem({ ...payload, restaurant: restaurant._id, category: itemForm.category });
      }
      setShowItemForm(false);
      setItemForm(emptyItemForm);
      await loadMenu(restaurant._id);
      notify(editingId ? 'Product updated' : 'Product added');
      setEditingId(null);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save the product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      await updateMenuItem(item._id, { isAvailable: !item.isAvailable });
      await loadMenu(restaurant._id);
    } catch (err) {
      notify('Failed to update the product');
    }
  };

  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    try {
      await deleteMenuItem(item._id);
      await loadMenu(restaurant._id);
      notify('Product deleted');
    } catch (err) {
      notify('Failed to delete the product');
    }
  };

  if (loading) return <Spinner label="Loading products..." />;
  if (error) return <div className="page-container"><EmptyState icon="⚠️" title="Error" subtitle={error} /></div>;

  return (
    <div className="page-container fade-in">
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>{restaurant.name} - Products</h1>
      <p style={{ color: 'var(--color-text-muted)', marginTop: 0, marginBottom: 24 }}>
        Manage your categories and products
      </p>

      <form onSubmit={handleAddCategory} className="card" style={{ padding: 16, marginBottom: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="New category name (e.g. Desserts)"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="input-field"
          style={{ flex: 1, minWidth: 200 }}
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
            <button onClick={() => openAdd(category._id)} className="btn btn-outline btn-sm">+ Add Product</button>
          </div>

          {category.items.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>No products yet.</p>
          ) : (
            <div className="prod-grid">
              {category.items.map((item) => (
                <div key={item._id} className="card" style={{ overflow: 'hidden' }}>
                  <SmartImage src={item.image} alt={item.name} className="prod-img" style={{ height: 130 }} fallback="🍽" />
                  <div style={{ padding: 14 }}>
                    <h4 style={{ margin: '0 0 4px', fontSize: 15 }}>{item.name}</h4>
                    <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                      Rs. {item.price}{!item.isAvailable && <span style={{ color: 'var(--color-danger)', marginLeft: 8, fontSize: 12 }}>Sold out</span>}
                    </p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button onClick={() => openEdit(item, category._id)} className="btn btn-outline btn-sm" style={{ flex: 1 }}>Edit</button>
                      <button
                        onClick={() => handleToggleAvailability(item)}
                        className={item.isAvailable ? 'btn btn-outline btn-sm' : 'btn btn-primary btn-sm'}
                        style={{ flex: 1 }}
                      >
                        {item.isAvailable ? 'Sold out' : 'Available'}
                      </button>
                      <button onClick={() => handleDeleteItem(item)} className="btn btn-danger-outline btn-sm">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {showItemForm && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: 16 }}
          onClick={() => setShowItemForm(false)}
        >
          <form
            onSubmit={handleSaveItem}
            onClick={(e) => e.stopPropagation()}
            className="card fade-in"
            style={{ padding: 24, width: '100%', maxWidth: 440, maxHeight: '90vh', overflowY: 'auto' }}
          >
            <h3 style={{ marginTop: 0 }}>{editingId ? 'Edit Product' : 'Add Product'}</h3>
            {formError && (
              <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '10px 12px', borderRadius: 8, fontSize: 14, marginBottom: 12 }}>
                {formError}
              </div>
            )}

            <label className="input-label">Name</label>
            <input type="text" className="input-field" style={{ marginBottom: 12 }} value={itemForm.name}
              onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} />

            <label className="input-label">Description</label>
            <input type="text" className="input-field" style={{ marginBottom: 12 }} value={itemForm.description}
              onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} />

            <label className="input-label">Price (Rs.)</label>
            <input type="number" min="1" className="input-field" style={{ marginBottom: 12 }} value={itemForm.price}
              onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })} />

            <label className="input-label">Image path or URL (optional)</label>
            <input type="text" className="input-field" style={{ marginBottom: 12 }} placeholder="/images/burger.jpg" value={itemForm.image}
              onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })} />

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 14 }}>
              <input type="checkbox" style={{ width: 'auto' }} checked={itemForm.isVeg}
                onChange={(e) => setItemForm({ ...itemForm, isVeg: e.target.checked })} />
              Vegetarian
            </label>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={() => setShowItemForm(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
              <button type="submit" disabled={saving} className="btn btn-primary" style={{ flex: 1 }}>
                {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {toast && (
        <div className="fade-in" style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--color-dark)', color: '#fff', padding: '12px 20px', borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 600, zIndex: 400 }}>
          {toast}
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
