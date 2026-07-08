const Card = ({ children, className = '' }) => (
  <section className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>{children}</section>
);

export default Card;
