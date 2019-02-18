export const answers = (state = {
    answerList: [],
    isLoading: true
}, action) => {

    let answers;

    switch (action.type) {

        // Wczytano odpowiedzi
        case 'ANSWERS_FETCHED':
            var newState = Object.assign({}, state, {
                answerList: [...action.answers],
                isLoading: false
            })
            return newState;


            // Dodano nową odpowiedź
        case 'ANSWER_ADDED':
            console.log('Nowa odpowiedź', action.answer);

            answers = [...state.answerList];
            answers.unshift(action.answer);
            var newState = Object.assign({}, state, {
                answerList: [...answers]
            })
            return newState;

            // Usunięto odpowiedź
        case 'ANSWER_DELETED':
            answers = state.answerList.filter(a => (
                a.answer_id !== action.answer_id));
            
            return Object.assign({},state,{
                answerList : [...answers]
            });

        default:
            return state;
    }
}