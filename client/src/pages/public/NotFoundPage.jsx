import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';

const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
    <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">404</p>
      <h1 className="mt-3 text-3xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-3 text-sm text-slate-600">The page you’re looking for does not exist or may have moved.</p>
      <div className="mt-6 flex justify-center">
        <Link to="/">
          <Button>Go home</Button>
        </Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
