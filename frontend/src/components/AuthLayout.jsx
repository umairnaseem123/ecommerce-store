import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth-chop.css';

const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const MailIcon = () => (
  <svg {...base} className="au-ico"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
export const LockIcon = () => (
  <svg {...base} className="au-ico"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
);
export const UserIcon = () => (
  <svg {...base} className="au-ico"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);
const EyeIcon = () => (
  <svg {...base}><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
);
const EyeOffIcon = () => (
  <svg {...base}><path d="M3 3l18 18M10.6 6.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.5 6.6C3.7 8.4 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 4.3-1M9.9 9.9a3 3 0 0 0 4.2 4.2" /></svg>
);
const TruckIcon = () => (
  <svg {...base} stroke="#fff"><path d="M1 6h13v10H1zM14 10h4l3 3v3h-7" /><circle cx="6" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>
);
const WalletIcon = () => (
  <svg {...base} stroke="#fff"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20M6 15h4" /></svg>
);
const StoreIcon = () => (
  <svg {...base} stroke="#fff"><path d="M3 9l2-5h14l2 5M3 9v11h18V9M3 9h18M9 20v-6h6v6" /></svg>
);

export const Logo = ({ className = '' }) => (
  <Link to="/" className={`au-logo ${className}`}>
    <span className="au-logo__mark">F</span>FoodStore
  </Link>
);

/* A text input with a leading icon. */
export const IconInput = ({ id, label, icon, ...props }) => (
  <div className="au-field">
    <label className="au-label" htmlFor={id}>{label}</label>
    <div className="au-input">
      {icon}
      <input id={id} {...props} />
    </div>
  </div>
);

/* Password input with show / hide toggle. */
export const PasswordInput = ({ id = 'password', label = 'Password', ...props }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="au-field">
      <label className="au-label" htmlFor={id}>{label}</label>
      <div className="au-input">
        <LockIcon />
        <input id={id} type={show ? 'text' : 'password'} {...props} />
        <button type="button" className="au-eye" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
};

/* Password strength bar (used on Register). */
export const StrengthMeter = ({ value = '' }) => {
  if (!value) return null;
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  const s = Math.max(score, 1);
  const label = ['', 'Weak', 'Fair', 'Good', 'Strong'][s];
  return (
    <div className="au-meter" data-s={s} aria-live="polite">
      <div className="au-meter__bars"><i /><i /><i /><i /></div>
      <small>Password strength: {label}</small>
    </div>
  );
};

const FEATURES = [
  { Icon: TruckIcon, title: 'Free delivery', sub: 'On every order' },
  { Icon: WalletIcon, title: 'Cash or card', sub: 'Pay the way you like' },
  { Icon: StoreIcon, title: 'Local kitchens', sub: 'Fresh and made to order' },
];
const FOOD = ['burger.jpg', 'pizza.avif', 'biryani.jpg', 'icecream.avif'];

const AuthLayout = ({ title, subtitle, error, children, footer }) => (
  <div className="au-page">
    <aside className="au-side">
      <div className="au-bg" aria-hidden="true" />
      <span className="au-glow au-glow--a" aria-hidden="true" />
      <span className="au-glow au-glow--b" aria-hidden="true" />

      <Logo />

      <div className="au-hero">
        <h2>Fresh food, <em>delivered fast.</em></h2>
        <p>Order from your favourite local restaurants and get it at your door in minutes.</p>
        <ul className="au-feats">
          {FEATURES.map(({ Icon, title: t, sub }) => (
            <li key={t}>
              <span className="au-feats__ico"><Icon /></span>
              <div><b>{t}</b><span>{sub}</span></div>
            </li>
          ))}
        </ul>
      </div>

      <div className="au-foot">
        <div className="au-stack" aria-hidden="true">
          {FOOD.map((f) => <img key={f} src={`/images/${f}`} alt="" />)}
        </div>
        <p>Burgers, pizza, biryani<br />and much more</p>
      </div>
    </aside>

    <div className="au-mhero">
      <Logo />
      <p>Fresh food, delivered fast.</p>
    </div>

    <main className="au-main">
      <div className="au-card">
        <h1>{title}</h1>
        <p className="au-sub">{subtitle}</p>
        {error && <div className="au-error" role="alert">{error}</div>}
        {children}
        <p className="au-alt">{footer}</p>
      </div>
    </main>
  </div>
);

export default AuthLayout;
