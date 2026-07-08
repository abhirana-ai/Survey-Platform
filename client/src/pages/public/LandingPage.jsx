import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';

const LandingPage = () => (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.12),_transparent_40%)] bg-slate-50 text-slate-900">
    <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-8 lg:px-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">Survey Platform</p>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/login">
          <Button variant="secondary">Login</Button>
        </Link>
        <Link to="/register">
          <Button>Get started</Button>
        </Link>
      </div>
    </header>

    <main className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
      <section className="grid items-center gap-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">Built for simple, secure surveys</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Create surveys, collect responses, and review results in one place.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Design text and multiple-choice surveys, share them with participants, and review the responses you receive from your team or clients.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register">
              <Button>Start building</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary">Sign in</Button>
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-violet-700">What you can do</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>• Create surveys with text and multiple-choice questions</li>
              <li>• Share surveys with authenticated participants</li>
              <li>• Collect and review response data</li>
              <li>• View survey results from your dashboard</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { title: 'Create surveys', description: 'Build structured forms quickly with a simple editor.' },
          { title: 'Collect responses', description: 'Let respondents complete surveys with text or choice-based answers.' },
          { title: 'Review results', description: 'Inspect the responses collected for each survey.' },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
          </div>
        ))}
      </section>
    </main>
  </div>
);

export default LandingPage;
