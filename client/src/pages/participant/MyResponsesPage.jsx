import { useEffect, useState } from 'react';
import Card from '../../components/common/Card.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import { getMyResponses } from '../../services/responseService.js';
import { getSurveys } from '../../services/surveyService.js';

const MyResponsesPage = () => {
  const [responses, setResponses] = useState([]);
  const [surveysById, setSurveysById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadResponses = async () => {
      try {
        setLoading(true);
        const [responseData, surveyData] = await Promise.all([getMyResponses(), getSurveys()]);
        const surveys = surveyData.surveys || [];
        const surveyMap = Object.fromEntries(surveys.map((survey) => [survey._id, survey]));
        setResponses(responseData.responses || []);
        setSurveysById(surveyMap);
      } catch (err) {
        setError(err.message || 'Unable to load responses.');
      } finally {
        setLoading(false);
      }
    };

    loadResponses();
  }, []);

  return (
    <div>
      <PageHeader title="My responses" description="Review the surveys you have already completed." />
      {error ? <p className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">Loading responses...</div>
      ) : responses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-600">You have not submitted any responses yet.</div>
      ) : (
        <div className="space-y-4">
          {responses.map((response) => {
            const survey = surveysById[response.survey];
            return (
              <Card key={response._id}>
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">Submitted response</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{survey?.title || 'Survey response'}</p>
                    {survey?.description ? <p className="mt-1 text-sm text-slate-600">{survey.description}</p> : null}
                  </div>
                  <p className="text-sm text-slate-500">{response.createdAt ? new Date(response.createdAt).toLocaleDateString() : 'Recently submitted'}</p>
                </div>
                <div className="mt-4 space-y-3">
                  {(response.answers || []).map((answer, index) => (
                    <div key={`${answer.question}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-sm font-medium text-slate-800">{answer.question}</p>
                      <p className="mt-1 text-sm text-slate-600">{answer.answer}</p>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyResponsesPage;
