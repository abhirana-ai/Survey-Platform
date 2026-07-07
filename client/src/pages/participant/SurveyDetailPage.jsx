import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import Input from '../../components/common/Input.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import { getSurveyById } from '../../services/surveyService.js';
import { submitResponse } from '../../services/responseService.js';

const SurveyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadSurvey = async () => {
      try {
        setLoading(true);
        const response = await getSurveyById(id);
        setSurvey(response.survey);
        setAnswers((response.survey?.questions || []).map((question) => ({ question: question.questionText, answer: '' })));
      } catch (err) {
        setError(err.message || 'Unable to load survey.');
      } finally {
        setLoading(false);
      }
    };

    loadSurvey();
  }, [id]);

  const updateAnswer = (index, value) => {
    setAnswers((current) => current.map((answer, answerIndex) => (answerIndex === index ? { ...answer, answer: value } : answer)));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const hasEmptyAnswers = answers.some((answer) => !answer.answer.trim());
    if (hasEmptyAnswers) {
      setError('Please answer every question.');
      return;
    }

    try {
      setSubmitting(true);
      await submitResponse({ survey: id, answers });
      setSuccess('Your response has been submitted.');
      navigate('/my-responses');
    } catch (err) {
      if (err.status === 409) {
        setError('You have already submitted a response to this survey.');
      } else {
        setError(err.message || 'Unable to submit response.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">Loading survey...</div>;
  }

  if (!survey) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">Survey not found.</div>;
  }

  return (
    <div>
      <PageHeader title={survey.title} description={survey.description || 'Complete the survey below.'} />
      {error ? <p className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
      {success ? <p className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p> : null}
      <form onSubmit={handleSubmit} className="space-y-4">
        {survey.questions?.map((question, index) => (
          <Card key={`${question.questionText}-${index}`}>
            <h2 className="text-lg font-semibold text-slate-900">{question.questionText}</h2>
            {question.questionType === 'text' ? (
              <div className="mt-4">
                <Input value={answers[index]?.answer || ''} onChange={(event) => updateAnswer(index, event.target.value)} placeholder="Type your answer" />
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                {question.options?.map((option) => (
                  <label key={option} className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
                    <input type="radio" name={`question-${index}`} value={option} checked={answers[index]?.answer === option} onChange={(event) => updateAnswer(index, event.target.value)} />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}
          </Card>
        ))}
        <div className="flex justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit response'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SurveyDetailPage;
