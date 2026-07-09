import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import SurveyBuilder from '../../components/survey/SurveyBuilder.jsx';
import { createSurvey } from '../../services/surveyService.js';

const CreateSurveyPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (payload) => {
    try {
      setLoading(true);
      setError('');
      const response = await createSurvey(payload);
      navigate(`/surveys/${response.survey._id}`);
    } catch (err) {
      setError(err.message || 'Unable to create survey.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create Survey" description="Publish a new questionnaire template. Specify questions, options, and input formatting." />
      <SurveyBuilder onSubmit={handleSubmit} submitLabel="Publish Survey Template" loading={loading} error={error} />
    </div>
  );
};

export default CreateSurveyPage;
