
// FORUM
// ------------------------------------------------------------------------------------------------

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

// Czyszczenie wyszukiwarki
export const clearForumSearching = () => (
  {
    type : 'CLEAR_FORUM_SEARCHING'
  }
)

// Wybrano pytanie 
export const selectCurrentQuestion = (qId) => ({
  type: 'SELECT_CURRENT_QUESTION',
  qId
});

// Wczytano listę odpowiedzi danego pytania
export const answersFetched = (answers) => ({
  type : 'ANSWERS_FETCHED',
  answers
})

// Dodano odpowiedź
export const answerAdded = (answer) => ({
  type : 'ANSWER_ADDED',
  answer
})

// Usunięto odpowiedź
export const answerDeleted = (answer_id) => ({
  type : 'ANSWER_DELETED',
  answer_id
})

// Zmieniono typ sortowania
export const sortChanged = (sort) => ({
  type : 'SORT_TYPE_CHANGED',
  sort
})

// SIŁOWNIE
// ------------------------------------------------------------------------------------------------

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

// Aktualizacja liczby wiadomości i liczby powiadomień
export const updateMsgNtf = (data) =>({
  type : 'UPDATE_MSG_NTF',
  data
})

