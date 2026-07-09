import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Button from '../../components/common/Button.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { getSurveys } from '../../services/surveyService.js';
import { getMyResponses, getSurveyResponses } from '../../services/responseService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  FileText, 
  Inbox, 
  ClipboardList, 
  PlusCircle, 
  ArrowRight, 
  Calendar, 
  Sparkles,
  ChevronRight,
  User
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allSurveys, setAllSurveys] = useState([]);
  const [responsesSubmitted, setResponsesSubmitted] = useState([]);
  const [totalResponsesReceived, setTotalResponsesReceived] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const mySurveys = useMemo(() => {
    return allSurveys.filter(s => s.createdBy === user?.id || s.createdBy === 'usr_default123');
  }, [allSurveys, user]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const [surveyData, responseData] = await Promise.all([
          getSurveys(),
          getMyResponses()
        ]);
        
        const surveysList = surveyData.surveys || [];
        setAllSurveys(surveysList);
        setResponsesSubmitted(responseData.responses || []);

        // Aggregate response counts for user-owned surveys
        const userSurveys = surveysList.filter(s => s.createdBy === user?.id || s.createdBy === 'usr_default123');
        const countPromises = userSurveys.map(s => 
          getSurveyResponses(s._id)
            .then(res => res.responses?.length || 0)
            .catch(() => 0)
        );
        const countsList = await Promise.all(countPromises);
        const sum = countsList.reduce((acc, val) => acc + val, 0);
        setTotalResponsesReceived(sum);

      } catch (err) {
        setError(err.message || 'Unable to retrieve dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const recentSurveys = useMemo(() => {
    return [...mySurveys]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  }, [mySurveys]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-600 to-indigo-700 p-6 md:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles size={12} />
            Platform Dashboard
          </span>
          <h1 className="mt-3.5 text-2xl font-bold tracking-tight md:text-3xl">
            Welcome back, {user?.name || 'Researcher'}
          </h1>
          <p className="mt-2 text-violet-100 text-sm max-w-xl">
            Publish custom forms, check student answers, and generate percentage analytics from your control deck.
          </p>
        </div>
        <div className="shrink-0">
          <Link to="/surveys/create">
            <Button variant="custom" className="bg-white text-black hover:bg-violet-700 hover:text-white font-bold shadow-md shadow-violet-950/20">
              <PlusCircle size={16} className="mr-2" />
              New Survey
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-150 bg-rose-50 px-4 py-3.5 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <Loader message="Synthesizing dashboard metrics..." variant="skeleton" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stat Grid */}
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard 
                title="My Surveys"
                value={mySurveys.length}
                icon={FileText}
                description="Forms created by you"
                trend={{ value: 'Live', positive: true }}
              />
              <StatCard 
                title="Responses Gathered"
                value={totalResponsesReceived}
                icon={Inbox}
                description="Total received answers"
                trend={{ value: '+12%', positive: true }}
              />
              <StatCard 
                title="Your Submissions"
                value={responsesSubmitted.length}
                icon={ClipboardList}
                description="Surveys you completed"
              />
            </div>

            {/* Recent Surveys */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-md font-bold text-slate-900">Recent Surveys</h2>
                <Link to="/surveys" className="text-xs font-semibold text-violet-600 hover:text-violet-700 transition flex items-center gap-1">
                  View all
                  <ChevronRight size={14} />
                </Link>
              </div>

              <div className="space-y-3">
                {recentSurveys.length === 0 ? (
                  <EmptyState 
                    title="No surveys yet"
                    description="Create your first survey form using the survey builder."
                    icon={FileText}
                    actionLabel="Create Survey"
                    onActionClick={() => navigate('/surveys/create')}
                  />
                ) : (
                  recentSurveys.map((survey) => (
                    <div 
                      key={survey._id} 
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-4 hover:border-violet-200 hover:bg-slate-50/30 transition duration-150"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-slate-900 truncate">{survey.title}</p>
                          <StatusBadge status="active" />
                        </div>
                        <p className="text-xs text-slate-500 truncate max-w-md">
                          {survey.description || 'No description provided.'}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(survey.createdAt).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>{survey.questions?.length || 0} Questions</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link to={`/surveys/${survey._id}/results`}>
                          <Button variant="secondary" className="px-3 py-1.5 text-xs">
                            Results
                          </Button>
                        </Link>
                        <Link to={`/surveys/${survey._id}`}>
                          <Button className="px-3 py-1.5 text-xs">
                            View Form
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar Panel - Quick Actions */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-md font-bold text-slate-900 mb-4">Quick Tasks</h2>
              <div className="space-y-2.5">
                <Link 
                  to="/surveys/create" 
                  className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 text-sm font-semibold text-slate-700 hover:border-violet-200 hover:bg-violet-50/10 hover:text-violet-700 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <PlusCircle size={16} className="text-violet-600" />
                    Create Survey
                  </span>
                  <ArrowRight size={14} className="text-slate-400" />
                </Link>

                <Link 
                  to="/surveys" 
                  className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 text-sm font-semibold text-slate-700 hover:border-violet-200 hover:bg-violet-50/10 hover:text-violet-700 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <FileText size={16} className="text-violet-600" />
                    Manage My Surveys
                  </span>
                  <ArrowRight size={14} className="text-slate-400" />
                </Link>

                <Link 
                  to="/my-responses" 
                  className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 text-sm font-semibold text-slate-700 hover:border-violet-200 hover:bg-violet-50/10 hover:text-violet-700 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <ClipboardList size={16} className="text-violet-600" />
                    Review Responses
                  </span>
                  <ArrowRight size={14} className="text-slate-400" />
                </Link>

                <Link 
                  to="/profile" 
                  className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 text-sm font-semibold text-slate-700 hover:border-violet-200 hover:bg-violet-50/10 hover:text-violet-700 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <User size={16} className="text-violet-600" />
                    Account Settings
                  </span>
                  <ArrowRight size={14} className="text-slate-400" />
                </Link>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-violet-50/30 to-indigo-50/10 border border-violet-100">
              <h3 className="text-sm font-bold text-violet-950 flex items-center gap-1.5">
                <Sparkles size={16} className="text-violet-600" />
                Did you know?
              </h3>
              <p className="mt-2 text-xs text-violet-900 leading-relaxed">
                You can test different input types on your surveys like text, radios, and checkboxes by specifying option fields in the builder.
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
