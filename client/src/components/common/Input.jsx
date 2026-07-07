const Input = ({ label, error, className = '', ...props }) => (
  <label className="block text-sm text-slate-700">
    {label ? <span className="mb-2 block font-medium">{label}</span> : null}
    <input
      className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : ''} ${className}`}
      {...props}
    />
    {error ? <span className="mt-1 block text-sm text-rose-600">{error}</span> : null}
  </label>
);

export default Input;
