import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { deleteSurvey, getSurveys } from '../../services/surveyService.js';
import Button from '../../components/common/Button.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import SurveyCard from '../../components/survey/SurveyCard.jsx';

const SurveysPage = () => {
  const { user } = useAuth();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const loadSurveys = async () => {
    try {
      setLoading(true);
      const response = await getSurveys();
      setSurveys(response.surveys || []);
    } catch (err) {
      setError(err.message || 'Unable to load surveys.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSurveys();
  }, []);

  const handleDelete = async () => {
    if (!confirmDelete) return;

    try {
      await deleteSurvey(confirmDelete._id);
      setConfirmDelete(null);
      await loadSurveys();
    } catch (err) {
      setError(err.message || 'Unable to delete survey.');
    }
  };

  return (
    <div>
      <PageHeader
        title="Surveys"
        description="Browse the surveys available in your workspace."
        action={<Button onClick={() => window.location.assign('/surveys/create')}>Create Survey</Button>}
      />

      {error ? <p className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">Loading surveys...</div>
      ) : surveys.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-600">No surveys found yet.</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {surveys.map((survey) => (
            <SurveyCard key={survey._id} survey={survey} currentUserId={user?.id} onDeleteClick={setConfirmDelete} />
          ))}
        </div>
      )}

      {confirmDelete ? (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">Delete survey?</h3>
            <p className="mt-2 text-sm text-slate-600">This action will permanently remove the survey and all related responses.</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SurveysPage;
