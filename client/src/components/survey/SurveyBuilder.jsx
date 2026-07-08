import { useEffect, useState } from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';

const createQuestion = () => ({
  id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
  questionText: '',
  questionType: 'text',
  options: [],
});

const emptyQuestion = () => createQuestion();

const SurveyBuilder = ({ initialValue, onSubmit, submitLabel = 'Save survey', loading = false, error = '' }) => {
  const [title, setTitle] = useState(initialValue?.title || '');
  const [description, setDescription] = useState(initialValue?.description || '');
  const [questions, setQuestions] = useState(initialValue?.questions?.length ? initialValue.questions.map((question) => ({ ...question, id: question.id || createQuestion().id })) : [emptyQuestion()]);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setTitle(initialValue?.title || '');
    setDescription(initialValue?.description || '');
    setQuestions(initialValue?.questions?.length ? initialValue.questions.map((question) => ({ ...question, id: question.id || createQuestion().id })) : [emptyQuestion()]);
  }, [initialValue]);

  const updateQuestion = (index, changes) => {
    setQuestions((current) => current.map((question, questionIndex) => (questionIndex === index ? { ...question, ...changes } : question)));
  };

  const addQuestion = () => {
    setQuestions((current) => [...current, createQuestion()]);
  };

  const removeQuestion = (index) => {
    setQuestions((current) => current.filter((_, questionIndex) => questionIndex !== index));
  };

  const addOption = (questionIndex) => {
    setQuestions((current) => current.map((question, index) => (index === questionIndex ? { ...question, options: [...(question.options || []), { id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, value: '' }] } : question)));
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setQuestions((current) => current.map((question, index) => (index === questionIndex ? { ...question, options: question.options.map((option, currentIndex) => (currentIndex === optionIndex ? { ...option, value } : option)) } : question)));
  };

  const removeOption = (questionIndex, optionIndex) => {
    setQuestions((current) => current.map((question, index) => (index === questionIndex ? { ...question, options: question.options.filter((_, currentIndex) => currentIndex !== optionIndex) } : question)));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValidationError('');

    if (!title.trim()) {
      setValidationError('A survey title is required.');
      return;
    }

    const sanitizedQuestions = questions.filter((question) => question.questionText.trim());

    if (sanitizedQuestions.length === 0) {
      setValidationError('Add at least one question.');
      return;
    }

    const normalizedQuestions = sanitizedQuestions.map((question) => ({
      questionText: question.questionText.trim(),
      questionType: question.questionType,
      options: question.questionType === 'multiple-choice' ? (question.options || []).filter(Boolean).map((option) => option.value.trim()) : [],
    }));

    onSubmit({ title: title.trim(), description: description.trim(), questions: normalizedQuestions });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Survey title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Customer feedback" />
          <Input label="Description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Optional description" />
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <div key={question.id || index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Question {index + 1}</h3>
              <Button type="button" variant="ghost" onClick={() => removeQuestion(index)}>
                Remove
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-[1.6fr_0.8fr]">
              <Input label="Question text" value={question.questionText} onChange={(event) => updateQuestion(index, { questionText: event.target.value })} placeholder="Ask your audience" />
              <label className="block text-sm text-slate-700">
                <span className="mb-2 block font-medium">Question type</span>
                <select
                  value={question.questionType}
                  onChange={(event) => updateQuestion(index, { questionType: event.target.value, options: event.target.value === 'multiple-choice' ? question.options || [] : [] })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                >
                  <option value="text">Text</option>
                  <option value="multiple-choice">Multiple choice</option>
                </select>
              </label>
            </div>

            {question.questionType === 'multiple-choice' ? (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-700">Options</p>
                  <Button type="button" variant="secondary" onClick={() => addOption(index)}>
                    Add option
                  </Button>
                </div>
                {(question.options || []).map((option, optionIndex) => (
                  <div key={option.id || optionIndex} className="flex items-center gap-2">
                    <Input value={option.value} onChange={(event) => updateOption(index, optionIndex, event.target.value)} placeholder={`Option ${optionIndex + 1}`} />
                    <Button type="button" variant="ghost" onClick={() => removeOption(index, optionIndex)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {(validationError || error) ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{validationError || error}</p> : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="secondary" onClick={addQuestion}>
          Add question
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default SurveyBuilder;
