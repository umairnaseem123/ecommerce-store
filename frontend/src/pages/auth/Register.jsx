import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card fade-in">
        <h1>Create your account</h1>
        <p className="sub">It takes less than a minute.</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="input-label" htmlFor="name">Full name</label>
            <input id="name" name="name" className="input-field" value={form.name} onChange={handleChange} required />
          </div>
          <div className="field">
            <label className="input-label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className="input-field" value={form.email} onChange={handleChange} required />
          </div>
          <div className="field">
            <label className="input-label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" className="input-field" value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: 13 }}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="auth-alt">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
};

export default Register;
