const StatusBadge = ({ status = 'active', className = '' }) => {
  const styles = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
    closed: 'bg-slate-100 text-slate-600 border-slate-200',
    draft: 'bg-amber-50 text-amber-700 border-amber-200/50',
  };

  const label = {
    active: 'Active',
    closed: 'Closed',
    draft: 'Draft',
  };

  const normalized = status.toLowerCase();
  const currentStyle = styles[normalized] || styles.active;
  const currentLabel = label[normalized] || status;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${currentStyle} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${normalized === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
      {currentLabel}
    </span>
  );
};

export default StatusBadge;
