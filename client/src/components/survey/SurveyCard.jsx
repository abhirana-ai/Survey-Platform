import { Link } from 'react-router-dom';
import Button from '../common/Button.jsx';
import StatusBadge from '../common/StatusBadge.jsx';
import { 
  Eye, 
  Edit, 
  BarChart3, 
  Trash2, 
  Calendar, 
  HelpCircle, 
  Users 
} from 'lucide-react';

const SurveyCard = ({ survey, currentUserId, responseCount = 0, onDeleteClick }) => {
  const isOwner = survey?.createdBy && currentUserId && (survey.createdBy === currentUserId || survey.createdBy === 'usr_default123');

  return (
    <article className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-violet-200 hover:shadow-md transition duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-950 group-hover:text-violet-700 transition duration-150 text-md truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              {survey.title}
            </h3>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <Calendar size={12} />
              <span>{survey.createdAt ? new Date(survey.createdAt).toLocaleDateString() : 'Recent'}</span>
            </div>
          </div>
          <StatusBadge status="active" />
        </div>

        <p className="mt-3.5 text-xs text-slate-600 leading-relaxed line-clamp-2">
          {survey.description || 'No description was entered for this survey form.'}
        </p>

        {/* Survey Meta Info */}
        <div className="mt-5 flex flex-wrap gap-4 border-y border-slate-50 py-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <HelpCircle size={15} className="text-slate-400 stroke-[1.8]" />
            <span>{survey.questions?.length || 0} Questions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={15} className="text-slate-400 stroke-[1.8]" />
            <span>{responseCount} Response{responseCount === 1 ? '' : 's'}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-50">
        <Link to={`/surveys/${survey._id}`} className="flex-1">
          <Button variant="secondary" className="w-full text-xs font-bold gap-1.5 py-2">
            <Eye size={13} />
            Fill Form
          </Button>
        </Link>
        
        {isOwner && (
          <div className="flex items-center gap-1.5">
            <Link to={`/surveys/${survey._id}/edit`}>
              <Button variant="secondary" className="p-2 flex items-center justify-center rounded-xl hover:text-violet-700 hover:border-violet-200">
                <Edit size={14} />
              </Button>
            </Link>
            
            <Link to={`/surveys/${survey._id}/results`}>
              <Button variant="secondary" className="p-2 flex items-center justify-center rounded-xl hover:text-violet-700 hover:border-violet-200">
                <BarChart3 size={14} />
              </Button>
            </Link>

            <Button 
              variant="ghost" 
              onClick={() => onDeleteClick(survey)}
              className="p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-700 rounded-xl"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        )}
      </div>
    </article>
  );
};

export default SurveyCard;
