import { useEffect, useState } from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import Card from '../common/Card.jsx';
import { parseQuestion, serializeQuestion } from '../../utils/questionParser.js';
import { 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  ListPlus, 
  HelpCircle,
  FileText,
  AlignLeft,
  CheckSquare,
  List
} from 'lucide-react';

const createQuestion = () => ({
  id: `${Date.now()}-${Math.random()}`,
  questionText: '',
  questionType: 'short-text',
  options: [],
});

const SurveyBuilder = ({ initialValue, onSubmit, submitLabel = 'Save survey', loading = false, error = '' }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([createQuestion()]);
  const [validationError, setValidationError] = useState('');

  const loadQuestions = (rawQuestions) => {
    if (!rawQuestions || !rawQuestions.length) return [createQuestion()];
    return rawQuestions.map((q) => {
      const parsed = parseQuestion(q);
      return {
        id: parsed._id || parsed.id || `${Date.now()}-${Math.random()}`,
        questionText: parsed.questionText,
        questionType: parsed.questionType,
        options: parsed.options ? parsed.options.map(opt => ({
          id: `${Date.now()}-${Math.random()}`,
          value: typeof opt === 'object' ? opt.value : opt
        })) : []
      };
    });
  };

  useEffect(() => {
    if (initialValue) {
      setTitle(initialValue.title || '');
      setDescription(initialValue.description || '');
      setQuestions(loadQuestions(initialValue.questions));
    }
  }, [initialValue]);

  const updateQuestion = (index, changes) => {
    setQuestions((current) => 
      current.map((q, i) => (i === index ? { ...q, ...changes } : q))
    );
  };

  const addQuestion = () => {
    setQuestions((current) => [...current, createQuestion()]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) {
      setValidationError('A survey requires at least one question.');
      return;
    }
    setQuestions((current) => current.filter((_, i) => i !== index));
  };

  const moveQuestion = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= questions.length) return;
    
    setQuestions((current) => {
      const copy = [...current];
      const temp = copy[index];
      copy[index] = copy[nextIndex];
      copy[nextIndex] = temp;
      return copy;
    });
  };

  const addOption = (questionIndex) => {
    setQuestions((current) => 
      current.map((q, idx) => {
        if (idx === questionIndex) {
          const newOpt = { id: `${Date.now()}-${Math.random()}`, value: '' };
          return { ...q, options: [...(q.options || []), newOpt] };
        }
        return q;
      })
    );
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setQuestions((current) => 
      current.map((q, idx) => {
        if (idx === questionIndex) {
          const updated = q.options.map((opt, oIdx) => 
            oIdx === optionIndex ? { ...opt, value } : opt
          );
          return { ...q, options: updated };
        }
        return q;
      })
    );
  };

  const removeOption = (questionIndex, optionIndex) => {
    setQuestions((current) => 
      current.map((q, idx) => {
        if (idx === questionIndex) {
          const filtered = q.options.filter((_, oIdx) => oIdx !== optionIndex);
          return { ...q, options: filtered };
        }
        return q;
      })
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValidationError('');

    if (!title.trim()) {
      setValidationError('A survey title is required.');
      return;
    }

    const validQuestions = questions.filter(q => q.questionText.trim());

    if (validQuestions.length === 0) {
      setValidationError('Add at least one question with text.');
      return;
    }

    // Double check choices questions have options
    const invalidChoices = validQuestions.some(q => 
      (q.questionType === 'multiple-choice' || q.questionType === 'checkboxes') && 
      (!q.options || q.options.filter(o => o.value.trim()).length === 0)
    );

    if (invalidChoices) {
      setValidationError('Please add at least one option to multiple choice and checkbox questions.');
      return;
    }

    const serialized = validQuestions.map((q) => {
      return serializeQuestion({
        questionText: q.questionText.trim(),
        questionType: q.questionType,
        options: q.options.map(o => o.value.trim()).filter(Boolean)
      });
    });

    onSubmit({ 
      title: title.trim(), 
      description: description.trim(), 
      questions: serialized 
    });
  };

  return (
    <form className="space-y-6 animate-in fade-in duration-300" onSubmit={handleSubmit}>
      {/* Title & Description Card */}
      <Card className="p-6 border-l-4 border-l-violet-600">
        <h2 className="text-md font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FileText size={18} className="text-violet-600" />
          Survey Information
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input 
            label="Survey Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g. Computer Science Course Survey" 
            required 
          />
          <Input 
            label="Survey Description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="e.g. Collect details about lecture pacing..." 
          />
        </div>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id || index} className="p-6 group hover:border-slate-300 transition duration-150 relative">
            
            {/* Header controls: Question count, order buttons, remove button */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle size={16} className="text-violet-600" />
                Question {index + 1}
              </h3>
              
              <div className="flex items-center gap-1">
                {/* Move Up */}
                <button
                  type="button"
                  onClick={() => moveQuestion(index, -1)}
                  disabled={index === 0}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ChevronUp size={15} />
                </button>
                {/* Move Down */}
                <button
                  type="button"
                  onClick={() => moveQuestion(index, 1)}
                  disabled={index === questions.length - 1}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ChevronDown size={15} />
                </button>
                
                <span className="h-4 w-px bg-slate-200 mx-1"></span>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                  title="Delete question"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Question Text & Type selector grid */}
            <div className="grid gap-4 md:grid-cols-[1.6fr_0.8fr]">
              <Input 
                label="Question Statement" 
                value={question.questionText} 
                onChange={(e) => updateQuestion(index, { questionText: e.target.value })} 
                placeholder="Write your question..." 
                required 
              />
              
              <label className="block text-sm text-slate-700">
                <span className="mb-2 block font-medium">Input Type</span>
                <select
                  value={question.questionType}
                  onChange={(e) => {
                    const type = e.target.value;
                    const defaultOptions = (type === 'multiple-choice' || type === 'checkboxes') 
                      ? [{ id: `${Date.now()}-1`, value: 'Option 1' }] 
                      : [];
                    updateQuestion(index, { questionType: type, options: defaultOptions });
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                >
                  <option value="short-text">Short Text</option>
                  <option value="long-text">Long Text</option>
                  <option value="multiple-choice">Multiple Choice (Radio)</option>
                  <option value="checkboxes">Checkboxes (Multiple Answers)</option>
                </select>
              </label>
            </div>

            {/* Dynamic preview and Options editing */}
            <div className="mt-4">
              {/* Choice option builder (multiple-choice or checkboxes) */}
              {(question.questionType === 'multiple-choice' || question.questionType === 'checkboxes') ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Edit Option Items</p>
                    <button
                      type="button"
                      onClick={() => addOption(index)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-700"
                    >
                      <Plus size={14} />
                      Add Option
                    </button>
                  </div>
                  
                  <div className="space-y-2.5">
                    {question.options?.map((option, oIdx) => (
                      <div key={option.id || oIdx} className="flex items-center gap-2">
                        {/* Radio or check circle design based on type */}
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center text-slate-300">
                          {question.questionType === 'multiple-choice' ? <List size={16} /> : <CheckSquare size={16} />}
                        </div>
                        <input
                          type="text"
                          value={option.value}
                          onChange={(e) => updateOption(index, oIdx, e.target.value)}
                          placeholder={`Option ${oIdx + 1}`}
                          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-violet-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(index, oIdx)}
                          className="p-2 text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Text preview visual mock */
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-4 text-xs text-slate-400">
                  <div className="flex items-center gap-2 mb-1.5">
                    {question.questionType === 'short-text' ? <FileText size={14} /> : <AlignLeft size={14} />}
                    <span className="font-semibold">{question.questionType === 'short-text' ? 'Short Text Preview' : 'Long Text Preview'}</span>
                  </div>
                  <div className={`h-8 rounded-lg bg-white border border-slate-100 mt-2 px-3 py-2 text-[10px] italic flex items-center select-none ${question.questionType === 'long-text' ? 'h-16 items-start' : ''}`}>
                    Participant text input area will display here...
                  </div>
                </div>
              )}
            </div>

          </Card>
        ))}
      </div>

      {/* Validation / API errors */}
      {(validationError || error) && (
        <div className="rounded-xl border border-rose-150 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {validationError || error}
        </div>
      )}

      {/* Action triggers */}
      <div className="flex items-center gap-3">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={addQuestion}
          className="shadow-sm"
        >
          <ListPlus size={16} className="mr-2" />
          Add Question Card
        </Button>
        
        <Button type="submit" disabled={loading} className="shadow-md shadow-violet-500/10">
          {loading ? 'Submitting Form...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default SurveyBuilder;
