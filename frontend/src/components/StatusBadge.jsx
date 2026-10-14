const variant = {
  pending: 'placed',
  confirmed: 'placed',
  preparing: 'preparing',
  out_for_delivery: 'onway',
  delivered: 'delivered',
  cancelled: 'cancelled',
};

const StatusBadge = ({ status = '' }) => (
  <span className={`ds-status ds-status--${variant[status] || 'placed'}`} style={{ textTransform: 'capitalize' }}>
    {status.replace(/_/g, ' ')}
  </span>
);

export default StatusBadge;
