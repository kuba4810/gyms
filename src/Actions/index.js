// Pytania zostały pobrane
export const questionsFetched = (questions) => ({
  type: 'FETCH_QUESTIONS_SUCCESS',
  questions
});

// Zmiana wartości input w wyszukiwarce pytań
export const searchQuestions = (newState) => ({
  type: 'SEARCH_QUESTIONS',
  newState
});

// Wybrano kategorie pytań
export const changeCategory = (category) => ({
  type: 'CHANGE_CATEGORY',
  category
});


// Wybrano pytanie 
export const selectCurrentQuestion = (qId) => ({
  type: 'SELECT_CURRENT_QUESTION',
  qId
});

// Lista siłowni została pobrana
export const gymsFetched = (gymList) => ({
  type : 'GYM_LIST_FETCHED',
  gymList
});

// Zmienona wartość input w wyszukiwarce siłowni
export const gymSearchChanged = (input) =>({
  type : 'GYM_SEARCH_CHANGED',
  input
});

// Pobrano dane pojedynczej siłowni
export const gymDetailsFetched = (gymDetails) => ({
  type: 'GYM_DETAILS_FETCHED',
  gymDetails
});

export const newCommentSent =(data) => ({
  type: 'NEW_COMMENT',
  data
});

export const evaluation_update = (data) => ({
  type : 'EVALUATION_UPDATE',
  data
});
// Użytkownik się zalogował 
// Akcja wykorzystywana również przy aktualizacji stanu po ponownym otwarciu przeglądarki
export const logedIn = (data) => ({
  type: 'LOGED_IN',
  data
});

// Użytkownik się wylogował
// Akcja wykorzystywana również przy aktualizacji stanu po ponownym otwarciu przeglądarki
export const loggedOut = () =>({
  type: 'LOGGED_OUT'
});

