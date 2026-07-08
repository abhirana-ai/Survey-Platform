const Loader = ({ message = 'Loading...', variant = 'spinner' }) => {
  if (variant === 'skeleton') {
    return (
      <div className="w-full space-y-4 animate-pulse">
        <div className="h-6 w-1/4 rounded bg-slate-200"></div>
        <div className="h-28 w-full rounded-2xl bg-slate-200"></div>
        <div className="h-28 w-full rounded-2xl bg-slate-200"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-500">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600"></div>
      <p className="mt-4 text-sm font-semibold tracking-wide">{message}</p>
    </div>
  );
};

export default Loader;
