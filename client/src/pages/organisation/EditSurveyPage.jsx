import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import SurveyBuilder from '../../components/survey/SurveyBuilder.jsx';
import { getSurveyById, updateSurvey } from '../../services/surveyService.js';

const EditSurveyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSurvey = async () => {
      try {
        setLoading(true);
        const response = await getSurveyById(id);
        setSurvey(response.survey);
      } catch (err) {
        setError(err.message || 'Unable to load survey.');
      } finally {
        setLoading(false);
      }
    };

    loadSurvey();
  }, [id]);

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);
      setError('');
      const response = await updateSurvey(id, payload);
      navigate(`/surveys/${response.survey._id}`);
    } catch (err) {
      setError(err.message || 'Unable to update survey.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">Loading survey...</div>;
  }

  return (
    <div>
      <PageHeader title="Edit Survey" description="Update your survey content and questions." />
      {error ? <p className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
      {survey ? <SurveyBuilder initialValue={survey} onSubmit={handleSubmit} submitLabel="Update survey" loading={saving} error={error} /> : null}
    </div>
  );
};

export default EditSurveyPage;
