import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { deleteSurvey, getSurveys } from '../../services/surveyService.js';
import { getSurveyResponses } from '../../services/responseService.js';
import Button from '../../components/common/Button.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import SurveyCard from '../../components/survey/SurveyCard.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { FileText, PlusCircle, Search, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SurveysPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [responseCounts, setResponseCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  // Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' or 'mine'

  const loadSurveysAndCounts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getSurveys();
      const list = response.surveys || [];
      setSurveys(list);

      // Load counts for user surveys
      const countPromises = list.map(async (srv) => {
        try {
          const res = await getSurveyResponses(srv._id);
          return { id: srv._id, count: res.responses?.length || 0 };
        } catch {
          return { id: srv._id, count: 0 };
        }
      });
      
      const counts = await Promise.all(countPromises);
      const countsMap = counts.reduce((acc, curr) => {
        acc[curr.id] = curr.count;
        return acc;
      }, {});
      setResponseCounts(countsMap);

    } catch (err) {
      setError(err.message || 'Unable to load surveys from workspace.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSurveysAndCounts();
  }, []);

  const handleDelete = async () => {
    if (!confirmDelete) return;

    try {
      await deleteSurvey(confirmDelete._id);
      setConfirmDelete(null);
      await loadSurveysAndCounts();
    } catch (err) {
      setError(err.message || 'Unable to delete survey.');
    }
  };

  // Filtered surveys calculation
  const filteredSurveys = useMemo(() => {
    return surveys
      .filter((srv) => {
        // Owner Filter
        if (filterType === 'mine') {
          return srv.createdBy === user?.id || srv.createdBy === 'usr_default123';
        }
        return true;
      })
      .filter((srv) => {
        // Search Filter
        const titleMatch = srv.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const descMatch = srv.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return titleMatch || descMatch;
      });
  }, [surveys, filterType, searchQuery, user]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="My Surveys"
        description="View and administer your active templates, review participant submission rates, or delete records."
        action={
          <Button onClick={() => navigate('/surveys/create')} className="shadow-sm">
            <PlusCircle size={16} className="mr-2" />
            Create Survey
          </Button>
        }
      />

      {error && (
        <div className="rounded-xl border border-rose-150 bg-rose-50 px-4 py-3.5 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search surveys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        {/* Tab Filter Toggles */}
        <div className="flex w-full sm:w-auto items-center gap-1.5 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
          <SlidersHorizontal size={14} className="text-slate-400 mr-1 hidden sm:block" />
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 sm:flex-initial rounded-lg px-4 py-2 text-xs font-semibold transition ${filterType === 'all' ? 'bg-violet-50 text-violet-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            All Templates
          </button>
          <button
            onClick={() => setFilterType('mine')}
            className={`flex-1 sm:flex-initial rounded-lg px-4 py-2 text-xs font-semibold transition ${filterType === 'mine' ? 'bg-violet-50 text-violet-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            My Surveys
          </button>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <Loader variant="skeleton" />
      ) : filteredSurveys.length === 0 ? (
        <EmptyState
          title="No surveys match your criteria"
          description={searchQuery ? 'Try adjustment of filters or search term parameters.' : 'Publish a survey first to generate list items.'}
          icon={FileText}
          actionLabel={!searchQuery ? 'Create Survey' : undefined}
          onActionClick={!searchQuery ? () => navigate('/surveys/create') : undefined}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredSurveys.map((survey) => (
            <SurveyCard
              key={survey._id}
              survey={survey}
              currentUserId={user?.id}
              responseCount={responseCounts[survey._id] || 0}
              onDeleteClick={setConfirmDelete}
            />
          ))}
        </div>
      )}

      {/* Reusable Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(confirmDelete)}
        title="Delete Survey Form?"
        description={`Are you sure you want to delete "${confirmDelete?.title || ''}"? This action permanently purges all submission metrics, responses, and records associated.`}
        confirmLabel="Permanently Delete"
        cancelLabel="Discard Action"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default SurveysPage;
