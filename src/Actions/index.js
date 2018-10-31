export const questionsFetched = (questions) => ({
  type: 'FETCH_QUESTIONS_SUCCESS',
  questions
});

export const searchQuestions = (newState) => ({
  type: 'SEARCH_QUESTIONS',
  newState
});

export const changeCategory = (category) => ({
  type: 'CHANGE_CATEGORY',
  category
});

export const logedIn = (data) => ({
  type: 'LOGED_IN',
  data
});

export const selectCurrentQuestion = (qId) => ({
  type: 'SELECT_CURRENT_QUESTION',
  qId
});