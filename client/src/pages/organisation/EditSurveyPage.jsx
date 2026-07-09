import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import SurveyBuilder from '../../components/survey/SurveyBuilder.jsx';
import Loader from '../../components/common/Loader.jsx';
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
    return <Loader message="Retrieving survey template..." variant="skeleton" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Survey" description="Update your survey content, rearrange question items, and customize choice options." />
      {error && <p className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
      {survey && <SurveyBuilder initialValue={survey} onSubmit={handleSubmit} submitLabel="Update Survey Template" loading={saving} error={error} />}
    </div>
  );
};

export default EditSurveyPage;

