const Spinner = ({ label }) => (
  <div style={{ textAlign: 'center', padding: '40px 0' }}>
    <div className="spinner" />
    {label && <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>{label}</p>}
  </div>
);

export default Spinner;