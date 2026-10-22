import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout, { IconInput, PasswordInput, MailIcon } from '../../components/AuthLayout';

// Demo account from the seed script. Delete DEMO and the "Use demo customer" button to remove the shortcut.
const DEMO = { email: 'customer@foodstore.com', password: 'Customer@123' };

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to order from your favourite restaurants."
      error={error}
      footer={<>New here? <Link to="/register">Create an account</Link></>}
    >
      <form onSubmit={handleSubmit}>
        <IconInput
          id="email" label="Email" type="email" icon={<MailIcon />}
          placeholder="you@example.com" autoComplete="email"
          value={email} onChange={(e) => setEmail(e.target.value)} required
        />
        <PasswordInput
          placeholder="Enter your password" autoComplete="current-password"
          value={password} onChange={(e) => setPassword(e.target.value)} required
        />
        <button type="submit" disabled={loading} className="au-btn">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="au-or">or</div>
      <button
        type="button"
        className="au-btn au-btn--ghost"
        onClick={() => { setEmail(DEMO.email); setPassword(DEMO.password); }}
      >
        Use demo customer
      </button>
    </AuthLayout>
  );
};

export default Login;
