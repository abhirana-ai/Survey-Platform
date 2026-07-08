import { useEffect, useState } from 'react';
import Card from '../../components/common/Card.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Button from '../../components/common/Button.jsx';
import { getMyResponses } from '../../services/responseService.js';
import { getSurveys } from '../../services/surveyService.js';
import { ClipboardList, Calendar, CheckSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyResponsesPage = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState([]);
  const [surveysById, setSurveysById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Expand/collapse state for response cards
  const [expandedResponses, setExpandedResponses] = useState({});

  useEffect(() => {
    const loadResponses = async () => {
      try {
        setLoading(true);
        setError('');
        const [responseData, surveyData] = await Promise.all([
          getMyResponses(), 
          getSurveys()
        ]);
        
        const list = responseData.responses || [];
        setResponses(list);

        const surveys = surveyData.surveys || [];
        const surveyMap = Object.fromEntries(surveys.map((s) => [s._id, s]));
        setSurveysById(surveyMap);

        // Expand first response card by default if exists
        if (list.length > 0) {
          setExpandedResponses({ [list[0]._id]: true });
        }
      } catch (err) {
        setError(err.message || 'Unable to load responses.');
      } finally {
        setLoading(false);
      }
    };

    loadResponses();
  }, []);

  const toggleExpand = (id) => {
    setExpandedResponses((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const cleanQuestionText = (text) => {
    return (text || '').replace(/\s+\[(short-text|long-text|multiple-choice|checkboxes)\]$/, '');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader 
        title="My Responses" 
        description="Review list entries of your completed surveys and view details of your submitted answers." 
      />

      {error && (
        <div className="rounded-xl border border-rose-150 bg-rose-50 px-4 py-3.5 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <Loader message="Fetching response logs..." variant="spinner" />
      ) : responses.length === 0 ? (
        <EmptyState
          title="No responses recorded"
          description="You have not participated in any surveys yet. Browse active surveys to get started."
          icon={ClipboardList}
          actionLabel="Browse Surveys"
          onActionClick={() => navigate('/surveys')}
        />
      ) : (
        <div className="space-y-4">
          {responses.map((resp) => {
            const survey = surveysById[resp.survey];
            const isExpanded = expandedResponses[resp._id];

            return (
              <Card key={resp._id} className="p-0 overflow-hidden border border-slate-200">
                
                {/* Header Collapsible Trigger */}
                <div 
                  onClick={() => toggleExpand(resp._id)}
                  className="flex items-center justify-between p-5 cursor-pointer bg-white hover:bg-slate-50/50 transition duration-150 select-none"
                >
                  <div className="space-y-1 min-w-0 pr-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-violet-600">
                      <CheckSquare size={12} />
                      Completed
                    </span>
                    <h3 className="text-sm font-bold text-slate-950 truncate">
                      {survey?.title || 'Survey Questionnaire'}
                    </h3>
                    <p className="text-xs text-slate-500 truncate max-w-sm">
                      {survey?.description || 'View details of answers submitted.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400">
                      <Calendar size={13} />
                      {resp.createdAt ? new Date(resp.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                    <button className="p-1.5 rounded-lg border border-slate-100 bg-slate-50 text-slate-500">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Answer List Details */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/30 p-5 space-y-4">
                    <div className="sm:hidden flex items-center gap-1.5 text-[10px] text-slate-450 border-b border-slate-100 pb-2 mb-1">
                      <Calendar size={13} />
                      <span>Submitted on {resp.createdAt ? new Date(resp.createdAt).toLocaleString() : 'Recent'}</span>
                    </div>

                    {(resp.answers || []).map((ans, index) => (
                      <div key={`${ans.question}-${index}`} className="space-y-1.5 pl-2 border-l-2 border-l-violet-200">
                        <p className="text-xs font-semibold text-slate-600">
                          Q{index + 1}: {cleanQuestionText(ans.question)}
                        </p>
                        <p className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs font-medium text-slate-900 leading-relaxed shadow-sm">
                          {ans.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyResponsesPage;
