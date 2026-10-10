import { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole, updateUserStatus } from '../../api/adminApi';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';

const roles = ['customer', 'manager', 'kitchen', 'admin'];

const roleColors = {
  customer: '#e0f2fe',
  manager: '#fef3c7',
  kitchen: '#fae8ff',
  admin: '#fee2e2',
};

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data.users);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      await updateUserRole(userId, newRole);
      await loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    setUpdatingId(userId);
    try {
      await updateUserStatus(userId, !currentStatus);
      await loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Spinner label="Loading users..." />;
  if (error) return <EmptyState icon="⚠️" title="Error" subtitle={error} />;
  if (users.length === 0) return <EmptyState icon="👥" title="No users found" />;

  // Stat summary
  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {roles.map((r) => (
          <div key={r} className="card" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: roleColors[r] === '#e0f2fe' ? 'var(--color-info)' : roleColors[r] === '#fef3c7' ? 'var(--color-warning)' : roleColors[r] === '#fae8ff' ? 'var(--color-purple)' : 'var(--color-danger)' }} />
            <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{r}</span>
            <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{roleCounts[r] || 0}</span>
          </div>
        ))}
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '12px 16px', fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Name</th>
              <th style={{ padding: '12px 16px', fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Email</th>
              <th style={{ padding: '12px 16px', fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Role</th>
              <th style={{ padding: '12px 16px', fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '12px 16px', fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: 14 }}>{u.name}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--color-text-muted)' }}>{u.email}</td>
                <td style={{ padding: '14px 16px' }}>
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    disabled={updatingId === u._id}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 6,
                      border: '1px solid var(--color-border)',
                      fontSize: 13,
                      background: roleColors[u.role],
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    className="badge"
                    style={{ background: u.isActive ? 'var(--color-success)' : 'var(--color-danger)' }}
                  >
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <button
                    onClick={() => handleToggleStatus(u._id, u.isActive)}
                    disabled={updatingId === u._id}
                    className={u.isActive ? 'btn btn-danger-outline btn-sm' : 'btn btn-primary btn-sm'}
                  >
                    {u.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTab;