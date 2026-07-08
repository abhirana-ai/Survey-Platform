import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Card from '../../components/common/Card.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import { User, Mail, Shield, Award, BarChart3, LogOut, CheckCircle } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [stats, setStats] = useState({ created: 0, completed: 0 });
  
  const [infoMessage, setInfoMessage] = useState('');
  const [infoError, setInfoError] = useState('');
  const [passMessage, setPassMessage] = useState('');
  const [passError, setPassError] = useState('');

  useEffect(() => {
    // Load local stats
    const surveys = JSON.parse(localStorage.getItem('mock_db_surveys') || '[]');
    const responses = JSON.parse(localStorage.getItem('mock_db_responses') || '[]');
    
    const createdCount = surveys.filter(s => s.createdBy === user?.id || s.createdBy === 'usr_default123').length;
    const completedCount = responses.filter(r => r.respondent === user?.id).length;
    
    setStats({ created: createdCount, completed: completedCount });
  }, [user]);

  const handleUpdateInfo = (e) => {
    e.preventDefault();
    setInfoMessage('');
    setInfoError('');

    if (!name.trim()) {
      setInfoError('Name cannot be empty.');
      return;
    }

    // Update in local storage
    const storedUser = JSON.parse(localStorage.getItem('survey_user') || '{}');
    storedUser.name = name.trim();
    localStorage.setItem('survey_user', JSON.stringify(storedUser));
    
    // Also update in mock users database
    const users = JSON.parse(localStorage.getItem('mock_db_users') || '[]');
    const updatedUsers = users.map(u => u._id === user?.id ? { ...u, name: name.trim() } : u);
    localStorage.setItem('mock_db_users', JSON.stringify(updatedUsers));

    setInfoMessage('Profile information updated successfully. Reload to apply changes completely.');
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setPassMessage('');
    setPassError('');

    if (!password || !confirmPassword) {
      setPassError('Password fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setPassError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setPassError('Password must be at least 6 characters.');
      return;
    }

    // Update in mock database
    const users = JSON.parse(localStorage.getItem('mock_db_users') || '[]');
    const updatedUsers = users.map(u => u._id === user?.id ? { ...u, password } : u);
    localStorage.setItem('mock_db_users', JSON.stringify(updatedUsers));

    setPassMessage('Password updated successfully.');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader 
        title="Profile Settings" 
        description="Manage your account profile details and security settings."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Stats and Info */}
        <div className="md:col-span-1 space-y-6">
          <Card className="flex flex-col items-center text-center p-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-violet-700">
              <User size={40} className="stroke-[1.5]" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">{user?.name || 'Administrator'}</h2>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Workspace Owner</p>
            <div className="mt-4 flex items-center gap-2 rounded-full bg-slate-50 border border-slate-200/60 px-3.5 py-1 text-xs text-slate-600">
              <Shield size={13} className="text-violet-600" />
              <span>Verified Account</span>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Award size={18} className="text-violet-600" />
              Activity Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-600">Surveys Created</span>
                <span className="text-md font-bold text-slate-900">{stats.created}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-sm text-slate-600">Surveys Answered</span>
                <span className="text-md font-bold text-slate-900">{stats.completed}</span>
              </div>
            </div>
          </Card>

          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        {/* Right Side: Settings Forms */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
              <User size={18} className="text-violet-600" />
              Personal Information
            </h3>
            
            {infoMessage && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-150 p-4 text-sm text-emerald-700">
                <CheckCircle size={16} />
                <span>{infoMessage}</span>
              </div>
            )}
            
            {infoError && (
              <div className="mb-4 rounded-xl bg-rose-50 border border-rose-150 p-4 text-sm text-rose-700">
                {infoError}
              </div>
            )}

            <form onSubmit={handleUpdateInfo} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                />
                <Input
                  label="Email Address"
                  value={email}
                  disabled
                  readOnly
                  className="bg-slate-50 cursor-not-allowed text-slate-500 border-slate-200"
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
              <Shield size={18} className="text-violet-600" />
              Change Password
            </h3>

            {passMessage && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-150 p-4 text-sm text-emerald-700">
                <CheckCircle size={16} />
                <span>{passMessage}</span>
              </div>
            )}

            {passError && (
              <div className="mb-4 rounded-xl bg-rose-50 border border-rose-150 p-4 text-sm text-rose-700">
                {passError}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="New Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit">Update Password</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
