import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Loader from '../../components/common/Loader.jsx';
import { getSurveyById } from '../../services/surveyService.js';
import { submitResponse } from '../../services/responseService.js';
import { parseQuestion } from '../../utils/questionParser.js';
import { 
  ClipboardSignature, 
  CheckCircle, 
  HelpCircle, 
  ArrowLeft, 
  AlertCircle 
} from 'lucide-react';

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
        setError('');
        const response = await getSurveyById(id);
        
        // Parse questions for frontend display, but keep raw text for submission matching backend
        const parsed = (response.survey?.questions || []).map(parseQuestion);
        
        setSurvey({
          ...response.survey,
          questions: parsed
        });

        setAnswers(
          parsed.map((q) => ({ 
            question: q.rawText || q.questionText, 
            answer: '' 
          }))
        );
      } catch (err) {
        setError(err.message || 'Unable to retrieve survey.');
      } finally {
        setLoading(false);
      }
    };

    loadSurvey();
  }, [id]);

  const updateAnswer = (index, value) => {
    setAnswers((current) => 
      current.map((ans, idx) => (idx === index ? { ...ans, answer: value } : ans))
    );
  };

  const toggleCheckboxAnswer = (index, optionValue) => {
    const currentVal = answers[index]?.answer || '';
    let selected = currentVal ? currentVal.split(', ') : [];

    if (selected.includes(optionValue)) {
      selected = selected.filter(item => item !== optionValue);
    } else {
      selected.push(optionValue);
    }

    updateAnswer(index, selected.join(', '));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const hasEmptyAnswers = answers.some((ans) => !ans.answer.trim());
    if (hasEmptyAnswers) {
      setError('Please answer every question before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      await submitResponse({ survey: id, answers });
      setSuccess('Your survey response has been recorded successfully!');
      
      // Redirect after a brief moment to let them see success
      setTimeout(() => navigate('/my-responses'), 1500);
    } catch (err) {
      if (err.status === 409) {
        setError('You have already submitted a response to this survey. Duplicate responses are restricted.');
      } else {
        setError(err.message || 'Unable to record response.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader message="Retrieving survey questionnaire form..." variant="spinner" />;
  }

  if (!survey) {
    return (
      <div className="mx-auto max-w-lg py-12 text-center">
        <AlertCircle className="mx-auto text-slate-400 mb-4" size={40} />
        <h2 className="text-lg font-bold text-slate-900">Survey Not Found</h2>
        <p className="mt-1 text-sm text-slate-500">The survey link you accessed might be expired or deleted.</p>
        <Button onClick={() => navigate('/dashboard')} className="mt-6">Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header Back Nav */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-950 transition"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Survey Title Card */}
      <Card className="p-6 border-t-4 border-t-violet-600">
        <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-700 mb-3">
          <ClipboardSignature size={12} />
          Active Survey
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">{survey.title}</h1>
        {survey.description && (
          <p className="mt-3 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
            {survey.description}
          </p>
        )}
      </Card>

      {/* Status Messages */}
      {error && (
        <div className="rounded-xl border border-rose-150 bg-rose-50 px-4 py-3.5 text-sm text-rose-700 flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-150 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-700 flex items-center gap-2">
          <CheckCircle size={16} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Form Submission */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {survey.questions?.map((question, index) => (
          <Card key={`${question.questionText}-${index}`} className="p-6">
            <h2 className="text-sm font-bold text-slate-900 flex items-start gap-2 leading-relaxed">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-500 font-bold mt-0.5">
                {index + 1}
              </span>
              <div className="flex-1">
                <span>{question.questionText}</span>
                <span className="text-rose-500 ml-1" title="Required field">*</span>
              </div>
            </h2>

            {/* Render input based on custom type */}
            <div className="mt-4 pl-7">
              {/* Short Text */}
              {question.questionType === 'short-text' && (
                <input
                  type="text"
                  value={answers[index]?.answer || ''}
                  onChange={(e) => updateAnswer(index, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  required
                />
              )}

              {/* Long Text */}
              {question.questionType === 'long-text' && (
                <textarea
                  rows={4}
                  value={answers[index]?.answer || ''}
                  onChange={(e) => updateAnswer(index, e.target.value)}
                  placeholder="Type your detailed response here..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 resize-none"
                  required
                />
              )}

              {/* Multiple Choice (Radio) */}
              {question.questionType === 'multiple-choice' && (
                <div className="space-y-2">
                  {question.options?.map((option) => (
                    <label 
                      key={option} 
                      className={`flex items-center gap-3 rounded-xl border p-3 text-sm text-slate-700 cursor-pointer transition select-none hover:bg-slate-50/50
                        ${answers[index]?.answer === option ? 'border-violet-500 bg-violet-50/10 text-violet-950 font-medium' : 'border-slate-200'}`}
                    >
                      <input 
                        type="radio" 
                        name={`question-${index}`} 
                        value={option} 
                        checked={answers[index]?.answer === option} 
                        onChange={(e) => updateAnswer(index, e.target.value)}
                        className="h-4 w-4 border-slate-350 text-violet-600 focus:ring-violet-500"
                        required
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Checkboxes */}
              {question.questionType === 'checkboxes' && (
                <div className="space-y-2">
                  {question.options?.map((option) => {
                    const isChecked = (answers[index]?.answer || '').split(', ').includes(option);
                    return (
                      <label 
                        key={option} 
                        className={`flex items-center gap-3 rounded-xl border p-3 text-sm text-slate-700 cursor-pointer transition select-none hover:bg-slate-50/50
                          ${isChecked ? 'border-violet-500 bg-violet-50/10 text-violet-950 font-medium' : 'border-slate-200'}`}
                      >
                        <input 
                          type="checkbox" 
                          value={option} 
                          checked={isChecked} 
                          onChange={() => toggleCheckboxAnswer(index, option)}
                          className="h-4 w-4 rounded border-slate-350 text-violet-600 focus:ring-violet-500"
                        />
                        <span>{option}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        ))}

        {/* Footer actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/50">
          <Button 
            type="submit" 
            disabled={submitting || success} 
            className="px-6 h-11 text-sm font-semibold shadow-lg shadow-violet-500/10"
          >
            {submitting ? 'Recording Submissions...' : 'Submit Questionnaire'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SurveyDetailPage;
