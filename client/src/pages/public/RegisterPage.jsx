import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { ClipboardSignature, AlertCircle, ArrowLeft } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email.trim() || !form.password || !form.confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Unable to create account. Please try again.');
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">Get Started</p>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-950">Create workspace</h1>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-rose-50 border border-rose-100 p-4 text-sm text-rose-700">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input 
            label="Name" 
            value={form.name} 
            onChange={(event) => setForm({ ...form, name: event.target.value })} 
            placeholder="Jane Doe" 
            required
          />
          <Input 
            label="Email Address" 
            type="email" 
            value={form.email} 
            onChange={(event) => setForm({ ...form, email: event.target.value })} 
            placeholder="you@example.com" 
            required
          />
          <Input 
            label="Password" 
            type="password" 
            value={form.password} 
            onChange={(event) => setForm({ ...form, password: event.target.value })} 
            placeholder="••••••••" 
            required
          />
          <Input 
            label="Confirm Password" 
            type="password" 
            value={form.confirmPassword} 
            onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} 
            placeholder="••••••••" 
            required
          />
          
          <Button type="submit" className="w-full h-11 text-sm font-semibold shadow-md shadow-violet-500/10 mt-6" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-violet-600 hover:text-violet-700 transition">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
