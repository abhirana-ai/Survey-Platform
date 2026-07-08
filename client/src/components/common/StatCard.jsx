import Card from './Card.jsx';

const StatCard = ({ title, value, icon: Icon, description, trend, className = '' }) => {
  return (
    <Card className={`relative overflow-hidden p-6 hover:shadow-md transition duration-200 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="mt-2.5 text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
        </div>
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 border border-violet-100">
            <Icon size={22} className="stroke-[1.8]" />
          </div>
        )}
      </div>
      {description && (
        <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
          {trend && (
            <span className={`font-semibold ${trend.positive ? 'text-emerald-600' : 'text-slate-500'}`}>
              {trend.value}
            </span>
          )}
          <span>{description}</span>
        </div>
      )}
    </Card>
  );
};

export default StatCard;
