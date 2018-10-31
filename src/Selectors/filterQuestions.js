export const getFilteredQuestions = (q, state) => {

        if (state.type == 'input') {
                var inputWords = state.text.split(" ");
                return q.filter(question => (question.topic.toLowerCase().includes(state.text.toLowerCase()) ));
        } else if (state.type = 'category') {
                return q.filter(question => (question.category.toLowerCase() == state.category.toLowerCase()))
        }
};