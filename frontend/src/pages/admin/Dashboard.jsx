import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-4">Welcome, {user?.name}</p>
      <button onClick={logout} className="bg-black text-white px-4 py-2 rounded-lg">Logout</button>
    </div>
  );
};

export default AdminDashboard;