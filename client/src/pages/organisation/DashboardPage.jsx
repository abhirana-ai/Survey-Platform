import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Button from '../../components/common/Button.jsx';
import { getSurveys } from '../../services/surveyService.js';
import { getMyResponses } from '../../services/responseService.js';
import { useAuth } from '../../context/AuthContext.jsx';

const DashboardPage = () => {
  const { user } = useAuth();
  const [surveys, setSurveys] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [surveyData, responseData] = await Promise.all([getSurveys(), getMyResponses()]);
        setSurveys(surveyData.surveys || []);
        setResponses(responseData.responses || []);
      } catch (err) {
        setError(err.message || 'Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const recentSurveys = useMemo(() => [...surveys].slice(0, 4), [surveys]);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name || 'there'}`}
        description="Manage your surveys, review activity, and keep track of submissions."
        action={<Link to="/surveys/create"><Button>Create Survey</Button></Link>}
      />

      {error ? <p className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">Loading dashboard...</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <p className="text-sm text-slate-500">Surveys</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{surveys.length}</p>
              </Card>
              <Card>
                <p className="text-sm text-slate-500">Responses</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{responses.length}</p>
              </Card>
              <Card>
                <p className="text-sm text-slate-500">Recent activity</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{recentSurveys.length}</p>
              </Card>
            </div>

            <Card>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Recent surveys</h2>
                <Link to="/surveys" className="text-sm font-semibold text-violet-700">View all</Link>
              </div>
              <div className="mt-5 space-y-3">
                {recentSurveys.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">No surveys yet. Create one to get started.</p>
                ) : (
                  recentSurveys.map((survey) => (
                    <div key={survey._id} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900">{survey.title}</p>
                        <p className="text-sm text-slate-600">{survey.description || 'No description provided.'}</p>
                      </div>
                      <Link to={`/surveys/${survey._id}`} className="text-sm font-semibold text-violet-700">Open</Link>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          <Card>
            <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
            <div className="mt-5 space-y-3">
              <Link to="/surveys/create" className="block rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Create a new survey
              </Link>
              <Link to="/surveys" className="block rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Browse surveys
              </Link>
              <Link to="/my-responses" className="block rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                View your responses
              </Link>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
