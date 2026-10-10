const statusColors = {
  pending: 'var(--color-warning)',
  confirmed: 'var(--color-info)',
  preparing: 'var(--color-purple)',
  out_for_delivery: 'var(--color-cyan)',
  delivered: 'var(--color-success)',
  cancelled: 'var(--color-danger)',
};

const StatusBadge = ({ status }) => (
  <span className="badge" style={{ background: statusColors[status] || '#888' }}>
    {status.replace(/_/g, ' ')}
  </span>
);

export default StatusBadge;