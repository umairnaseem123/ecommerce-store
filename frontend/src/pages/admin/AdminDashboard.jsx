import { useState } from 'react';
import UsersTab from './UsersTab';
import RestaurantsTab from './RestaurantsTab';
import OrdersTab from './OrdersTab';

const tabs = [
  { key: 'Users', icon: '👥' },
  { key: 'Restaurants', icon: '🏪' },
  { key: 'Orders', icon: '📦' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Users');

  return (
    <div className="page-container fade-in">
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Admin Dashboard</h1>
      <p style={{ color: 'var(--color-text-muted)', marginTop: 0, marginBottom: 24 }}>
        Manage users, restaurants, and orders across the platform
      </p>

      <div style={{ display: 'flex', gap: 6, borderBottom: '1px solid var(--color-border)', marginBottom: 24 }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 18px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === tab.key ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === tab.key ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
              fontWeight: activeTab === tab.key ? 700 : 500,
              cursor: 'pointer',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'color 0.15s ease',
            }}
          >
            <span>{tab.icon}</span> {tab.key}
          </button>
        ))}
      </div>

      {activeTab === 'Users' && <UsersTab />}
      {activeTab === 'Restaurants' && <RestaurantsTab />}
      {activeTab === 'Orders' && <OrdersTab />}
    </div>
  );
};

export default AdminDashboard;