import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/common/Card.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import { getSurveyResponses } from '../../services/responseService.js';
import { getSurveyById } from '../../services/surveyService.js';

const SurveyResultsPage = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [surveyResponse, responseResponse] = await Promise.all([getSurveyById(id), getSurveyResponses(id)]);
        setSurvey(surveyResponse.survey);
        setResponses(responseResponse.responses || []);
      } catch (err) {
        setError(err.message || 'Unable to load survey results.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const choiceBreakdown = useMemo(() => {
    const questionMap = new Map();
    survey?.questions?.forEach((question) => {
      if (question.questionType === 'multiple-choice') {
        questionMap.set(question.questionText, { options: question.options || [], counts: Object.fromEntries((question.options || []).map((option) => [option, 0])) });
      }
    });

    responses.forEach((response) => {
      (response.answers || []).forEach((answer) => {
        const questionData = questionMap.get(answer.question);
        if (questionData && questionData.counts[answer.answer] !== undefined) {
          questionData.counts[answer.answer] += 1;
        }
      });
    });

    return Array.from(questionMap.entries()).map(([question, data]) => ({
      question,
      total: responses.length,
      options: Object.entries(data.counts).map(([option, count]) => ({ option, count, percentage: responses.length ? Math.round((count / responses.length) * 100) : 0 })),
    }));
  }, [responses, survey]);

  return (
    <div>
      <PageHeader title="Survey results" description="Review the raw submissions and simple summaries for this survey." />
      {error ? <p className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">Loading results...</div>
      ) : (
        <div className="space-y-6">
          <Card>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">Overview</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{responses.length} response{responses.length === 1 ? '' : 's'}</p>
            <p className="mt-2 text-sm text-slate-600">{survey?.title}</p>
          </Card>

          <div className="space-y-4">
            {choiceBreakdown.map((item) => (
              <Card key={item.question}>
                <h2 className="text-lg font-semibold text-slate-900">{item.question}</h2>
                <div className="mt-4 space-y-3">
                  {item.options.map((option) => (
                    <div key={option.option}>
                      <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                        <span>{option.option}</span>
                        <span>{option.count} ({option.percentage}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div className="h-2 rounded-full bg-violet-600" style={{ width: `${option.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <Card>
            <h2 className="text-lg font-semibold text-slate-900">Raw responses</h2>
            <div className="mt-4 space-y-3">
              {responses.length === 0 ? (
                <p className="text-sm text-slate-600">No submissions yet.</p>
              ) : (
                responses.map((response) => (
                  <div key={response._id} className="rounded-xl border border-slate-200 px-4 py-3">
                    <p className="text-sm font-medium text-slate-700">Response submitted on {response.createdAt ? new Date(response.createdAt).toLocaleDateString() : 'unknown date'}</p>
                    <div className="mt-2 space-y-2">
                      {(response.answers || []).map((answer, index) => (
                        <div key={`${answer.question}-${index}`} className="text-sm text-slate-600">
                          <span className="font-medium text-slate-800">{answer.question}:</span> {answer.answer}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SurveyResultsPage;
