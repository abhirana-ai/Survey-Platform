import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Mail, Lock, ClipboardSignature, AlertCircle, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.email.trim() || !form.password) {
      setError('Email and password are required.');
      return;
    }

    try {
      setLoading(true);
      await login({ email: form.email.trim(), password: form.password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.05),_transparent_45%)]">
      {/* Return Home Link */}
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition">
        <ArrowLeft size={16} />
        Back to home
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* Brand Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="mx-auto sm:mx-0 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-500/25 mb-4">
            <ClipboardSignature size={20} className="stroke-[2.5]" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">Welcome Back</p>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-950">Sign in to workspace</h1>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-rose-50 border border-rose-100 p-4 text-sm text-rose-700">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Input 
              label="Email Address" 
              type="email" 
              value={form.email} 
              onChange={(event) => setForm({ ...form, email: event.target.value })} 
              placeholder="you@example.com" 
              required
            />
          </div>
          <div>
            <Input 
              label="Password" 
              type="password" 
              value={form.password} 
              onChange={(event) => setForm({ ...form, password: event.target.value })} 
              placeholder="••••••••" 
              required
            />
          </div>
          
          <Button type="submit" className="w-full h-11 text-sm font-semibold shadow-md shadow-violet-500/10 mt-6" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Need a workspace?{' '}
          <Link to="/register" className="font-semibold text-violet-600 hover:text-violet-700 transition">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
