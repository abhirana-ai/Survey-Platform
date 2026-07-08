import Button from './Button.jsx';

const EmptyState = ({ 
  title = 'No records found', 
  description = 'There is no data to display at this moment.', 
  icon: Icon, 
  actionLabel, 
  onActionClick 
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 border border-slate-100 mb-5">
          <Icon size={24} className="stroke-[1.5]" />
        </div>
      )}
      <h3 className="text-md font-bold text-slate-900">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500 leading-relaxed">{description}</p>
      {actionLabel && onActionClick && (
        <Button className="mt-6 shadow-sm" onClick={onActionClick}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
