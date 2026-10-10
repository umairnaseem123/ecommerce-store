const EmptyState = ({ icon = '🍽️', title, subtitle, action }) => (
  <div className="state-box fade-in">
    <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
    <h3>{title}</h3>
    {subtitle && <p>{subtitle}</p>}
    {action}
  </div>
);

export default EmptyState;