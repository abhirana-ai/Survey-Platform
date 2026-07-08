import { Link } from 'react-router-dom';
import Button from '../common/Button.jsx';

const SurveyCard = ({ survey, currentUserId, onDelete, onDeleteClick }) => {
  const isOwner = survey?.createdBy && currentUserId && survey.createdBy === currentUserId;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{survey.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{survey.description || 'No description provided.'}</p>
        </div>
        {isOwner ? <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">Owner</span> : null}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {survey.questions?.map((question, index) => (
          <span key={`${question.questionText}-${index}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
            {question.questionType}
          </span>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to={`/surveys/${survey._id}`}>
          <Button variant="secondary">View</Button>
        </Link>
        {isOwner ? (
          <>
            <Link to={`/surveys/${survey._id}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>
            <Link to={`/surveys/${survey._id}/results`}>
              <Button variant="secondary">Results</Button>
            </Link>
            <Button variant="ghost" onClick={() => onDeleteClick(survey)}>
              Delete
            </Button>
          </>
        ) : null}
      </div>
    </article>
  );
};

export default SurveyCard;
