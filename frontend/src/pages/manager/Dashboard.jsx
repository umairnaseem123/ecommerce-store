import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyRestaurants } from '../../api/restaurantApi';
import { getRestaurantOrders } from '../../api/orderApi';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';

const Dashboard = () => {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        const ordersData = await getRestaurantOrders(myRestaurant._id);
        setOrders(ordersData.orders);
      } catch (err) {
        setError('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) return <Spinner label="Loading your dashboard..." />;

  if (error) {
    return (
      <div className="page-container">
        <EmptyState icon="⚠️" title="Something's not right" subtitle={error} />
      </div>
    );
  }

  const activeOrders = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status));
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const revenueToday = orders
    .filter((o) => new Date(o.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.quantity, 0), 0);

  return (
    <div className="fade-in">
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, #fb923c 100%)',
          color: '#fff',
          padding: '56px 20px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, margin: '0 0 8px' }}>
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ fontSize: 16, opacity: 0.95, margin: 0 }}>
            Managing <strong>{restaurant?.name}</strong>
          </p>
        </div>
      </div>

      <div className="page-container">
        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 32 }}>
          <div className="card" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📦</div>
            <div>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{orders.length}</p>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>Total Orders</p>
            </div>
          </div>
          <div className="card" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🔥</div>
            <div>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{activeOrders.length}</p>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>Active Orders</p>
            </div>
          </div>
          <div className="card" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>💰</div>
            <div>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Rs. {revenueToday}</p>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>Revenue Today</p>
            </div>
          </div>
        </div>

        {/* Quick action cards */}
        <h2 style={{ fontSize: 19, fontWeight: 800, marginBottom: 14 }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
          <Link
            to="/manager/orders"
            className="card card-hover"
            style={{ padding: 22, textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}
          >
            <div style={{ fontSize: 30 }}>📋</div>
            <h3 style={{ margin: 0, fontSize: 16, color: 'var(--color-text)' }}>Manage Orders</h3>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>
              {pendingOrders.length > 0
                ? `${pendingOrders.length} order${pendingOrders.length > 1 ? 's' : ''} waiting for confirmation`
                : 'View and update incoming orders'}
            </p>
          </Link>

          <Link
            to="/manager/menu"
            className="card card-hover"
            style={{ padding: 22, textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}
          >
            <div style={{ fontSize: 30 }}>🍽️</div>
            <h3 style={{ margin: 0, fontSize: 16, color: 'var(--color-text)' }}>Manage Menu</h3>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>
              Add categories, items, prices, and photos
            </p>
          </Link>
        </div>

        {/* Recent orders preview */}
        <h2 style={{ fontSize: 19, fontWeight: 800, marginBottom: 14 }}>Recent Orders</h2>
        {orders.length === 0 ? (
          <EmptyState icon="📭" title="No orders yet" subtitle="New orders will show up here as customers place them." />
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {orders.slice(0, 3).map((order) => {
              const total = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
              return (
                <div key={order._id} className="card" style={{ padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{order.user?.name || 'Customer'}</p>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <p style={{ margin: 0, fontWeight: 700 }}>Rs. {total}</p>
                </div>
              );
            })}
            <Link to="/manager/orders" style={{ fontSize: 13, color: 'var(--color-primary-dark)', fontWeight: 600, textDecoration: 'none', marginTop: 4 }}>
              View all orders →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;