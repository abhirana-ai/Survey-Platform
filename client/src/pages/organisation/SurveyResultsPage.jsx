import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Loader from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { getSurveyResponses } from '../../services/responseService.js';
import { getSurveyById } from '../../services/surveyService.js';
import { parseQuestion } from '../../utils/questionParser.js';
import { 
  BarChart3, 
  Inbox, 
  ArrowLeft, 
  Calendar, 
  MessageSquareText, 
  FileSpreadsheet,
  CheckCircle 
} from 'lucide-react';

const SurveyResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadResultsData = async () => {
      try {
        setLoading(true);
        setError('');
        const [surveyRes, responseRes] = await Promise.all([
          getSurveyById(id),
          getSurveyResponses(id)
        ]);
        
        // Parse questions for cleaner access
        const parsedQuestions = (surveyRes.survey?.questions || []).map(parseQuestion);
        
        setSurvey({
          ...surveyRes.survey,
          questions: parsedQuestions
        });
        setResponses(responseRes.responses || []);
      } catch (err) {
        setError(err.message || 'Unable to retrieve survey analytics.');
      } finally {
        setLoading(false);
      }
    };

    loadResultsData();
  }, [id]);

  // Aggregate Option Counts
  const questionAnalytics = useMemo(() => {
    if (!survey || !responses.length) return [];

    return survey.questions.map((q) => {
      const isChoice = q.questionType === 'multiple-choice' || q.questionType === 'checkboxes';
      
      if (isChoice) {
        // Initialize options counter
        const counts = {};
        q.options?.forEach(opt => {
          counts[opt] = 0;
        });

        // Count answers
        responses.forEach((resp) => {
          const ansObj = resp.answers?.find(a => a.question === q.rawText || a.question === q.questionText);
          if (ansObj && ansObj.answer) {
            if (q.questionType === 'checkboxes') {
              // Split multi-select values
              const parts = ansObj.answer.split(', ');
              parts.forEach(part => {
                if (counts[part] !== undefined) {
                  counts[part] += 1;
                }
              });
            } else {
              // Radio single value
              if (counts[ansObj.answer] !== undefined) {
                counts[ansObj.answer] += 1;
              }
            }
          }
        });

        const totalChoiceAnswers = Object.values(counts).reduce((a, b) => a + b, 0);

        return {
          questionText: q.questionText,
          questionType: q.questionType,
          isChoice: true,
          options: Object.entries(counts).map(([option, count]) => ({
            option,
            count,
            percentage: responses.length ? Math.round((count / responses.length) * 100) : 0
          }))
        };
      } else {
        // Text type responses list
        const textAnswers = responses
          .map((resp) => {
            const ansObj = resp.answers?.find(a => a.question === q.rawText || a.question === q.questionText);
            return {
              answer: ansObj?.answer || '',
              date: resp.createdAt
            };
          })
          .filter(a => a.answer.trim() !== '');

        return {
          questionText: q.questionText,
          questionType: q.questionType,
          isChoice: false,
          answers: textAnswers
        };
      }
    });
  }, [survey, responses]);

  if (loading) {
    return <Loader message="Generating visual response matrices..." variant="spinner" />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-in fade-in duration-300">
      
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-950 transition"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Main Stats Header */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5 sm:col-span-2 border-l-4 border-l-violet-600 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Campaign Results</span>
              <StatusBadge status="active" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-950">{survey?.title}</h1>
            <p className="mt-1 text-xs text-slate-500 truncate max-w-md">{survey?.description || 'No description provided.'}</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-4">
            <Calendar size={13} />
            <span>Published on {survey?.createdAt ? new Date(survey.createdAt).toLocaleDateString() : 'recent'}</span>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between bg-violet-600 text-white border-none shadow-md shadow-violet-500/20">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-violet-250">Participation rate</p>
            <p className="mt-2 text-4xl font-extrabold tracking-tight">{responses.length}</p>
          </div>
          <p className="text-[10px] text-violet-100 flex items-center gap-1 mt-4">
            <Inbox size={13} />
            Submissions received
          </p>
        </Card>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-150 bg-rose-50 px-4 py-3.5 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Question Analytical Breakdown Cards */}
      <div className="space-y-4">
        <h2 className="text-md font-bold text-slate-900 flex items-center gap-2 pl-1">
          <BarChart3 size={18} className="text-violet-600" />
          Question Breakdown
        </h2>

        {responses.length === 0 ? (
          <Card className="p-10 text-center">
            <Inbox className="mx-auto text-slate-350 mb-3" size={32} />
            <h3 className="text-sm font-bold text-slate-900">No responses recorded</h3>
            <p className="text-xs text-slate-500 mt-1">There are no submission records for this survey template yet.</p>
          </Card>
        ) : (
          questionAnalytics.map((analysis, index) => (
            <Card key={index} className="p-6">
              <h3 className="text-sm font-bold text-slate-950 flex items-start gap-2.5 leading-relaxed">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-500 font-bold mt-0.5">
                  {index + 1}
                </span>
                <span>{analysis.questionText}</span>
              </h3>

              <div className="mt-5 pl-7">
                {analysis.isChoice ? (
                  /* Choice aggregated bars */
                  <div className="space-y-3">
                    {analysis.options.map((opt) => (
                      <div key={opt.option} className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-650">
                          <span className="font-semibold text-slate-800">{opt.option}</span>
                          <span className="font-semibold text-slate-600">{opt.count} vote{opt.count === 1 ? '' : 's'} ({opt.percentage}%)</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100">
                          <div 
                            className="h-2 rounded-full bg-violet-600 transition-all duration-500" 
                            style={{ width: `${opt.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Text comments scroll block */
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 mb-2 uppercase">
                      <MessageSquareText size={12} />
                      <span>{analysis.answers?.length || 0} Comments received</span>
                    </div>
                    {analysis.answers?.length === 0 ? (
                      <p className="text-xs italic text-slate-400">No text comments written.</p>
                    ) : (
                      analysis.answers.map((ans, aIdx) => (
                        <div 
                          key={aIdx} 
                          className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-xs text-slate-700 space-y-1"
                        >
                          <p className="leading-relaxed font-medium text-slate-850">"{ans.answer}"</p>
                          <p className="text-[9px] text-slate-400 text-right">
                            {new Date(ans.date).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Raw Submissions Table */}
      {responses.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
              <FileSpreadsheet size={16} className="text-violet-600" />
              Raw Submissions Log
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">Respondent ID</th>
                  <th className="py-2.5 px-3">Date Submitted</th>
                  <th className="py-2.5 px-3 text-right">Answers Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {responses.map((resp) => (
                  <tr key={resp._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500">{resp.respondent || 'Anonymous'}</td>
                    <td className="py-3 px-3 text-slate-655">
                      {resp.createdAt ? new Date(resp.createdAt).toLocaleString() : 'Recent'}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-700">{resp.answers?.length || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

    </div>
  );
};

export default SurveyResultsPage;
