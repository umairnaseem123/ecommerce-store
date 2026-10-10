import { useAuth } from '../../context/AuthContext';

const KitchenDashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold mb-2">Kitchen Dashboard</h1>
      <p className="text-gray-500 mb-4">Welcome, {user?.name}</p>
      <button onClick={logout} className="bg-black text-white px-4 py-2 rounded-lg">Logout</button>
    </div>
  );
};

export default KitchenDashboard;