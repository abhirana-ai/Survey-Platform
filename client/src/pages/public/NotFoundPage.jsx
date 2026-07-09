import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import { Compass, ArrowRight } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.05),_transparent_40%)]">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 border border-violet-100 mb-6">
          <Compass size={28} className="stroke-[1.5] animate-spin-slow" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">Error 404</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Lost in Workspace?</h1>
        <p className="mt-2.5 text-sm leading-relaxed text-slate-500">
          The page link you followed does not exist or may have been archived or moved.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/dashboard">
            <Button className="h-10 text-xs font-semibold shadow-sm">
              Go to Dashboard
            </Button>
          </Link>
          <Link to="/">
            <Button variant="secondary" className="h-10 text-xs font-semibold">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
