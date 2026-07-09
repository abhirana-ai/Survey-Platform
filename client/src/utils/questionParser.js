/**
 * Utility functions to serialize and deserialize questions.
 * This maps custom frontend question types ("short-text", "long-text", "multiple-choice", "checkboxes")
 * to the backend's supported "text" and "multiple-choice" enums using text suffixes.
 */

export const parseQuestion = (question) => {
  if (!question) return null;
  
  let type = question.questionType;
  let text = question.questionText || '';
  
  // Look for suffix pattern like "Your question text? [long-text]"
  const match = text.match(/(.*)\s+\[(short-text|long-text|multiple-choice|checkboxes)\]$/);
  
  if (match) {
    text = match[1].trim();
    type = match[2];
  } else {
    // Fallback if no suffix exists
    if (type === 'text') {
      type = 'short-text';
    } else if (type === 'multiple-choice') {
      type = 'multiple-choice';
    }
  }
  
  return {
    ...question,
    questionText: text,
    questionType: type,
    rawText: question.questionText // Keep raw text if needed
  };
};

export const serializeQuestion = (question) => {
  if (!question) return null;
  
  const frontendType = question.questionType || 'short-text';
  let backendType = 'text';
  
  if (frontendType === 'multiple-choice' || frontendType === 'checkboxes') {
    backendType = 'multiple-choice';
  }
  
  // Format options: filter empty options and map to strings
  let options = [];
  if (frontendType === 'multiple-choice' || frontendType === 'checkboxes') {
    options = (question.options || [])
      .map(opt => typeof opt === 'object' ? opt.value : opt)
      .filter(val => typeof val === 'string' && val.trim() !== '');
  }
  
  return {
    questionText: `${question.questionText.trim()} [${frontendType}]`,
    questionType: backendType,
    options
  };
};
