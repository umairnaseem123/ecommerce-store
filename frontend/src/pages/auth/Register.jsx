import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout, { IconInput, PasswordInput, StrengthMeter, MailIcon, UserIcon } from '../../components/AuthLayout';

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
    <AuthLayout
      title="Create your account"
      subtitle="It takes less than a minute."
      error={error}
      footer={<>Already have an account? <Link to="/login">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit}>
        <IconInput
          id="name" name="name" label="Full name" icon={<UserIcon />}
          placeholder="Your name" autoComplete="name"
          value={form.name} onChange={handleChange} required
        />
        <IconInput
          id="email" name="email" type="email" label="Email" icon={<MailIcon />}
          placeholder="you@example.com" autoComplete="email"
          value={form.email} onChange={handleChange} required
        />
        <PasswordInput
          name="password" placeholder="Create a password" autoComplete="new-password"
          value={form.password} onChange={handleChange} required
        />
        <StrengthMeter value={form.password} />
        <button type="submit" disabled={loading} className="au-btn">
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Register;
