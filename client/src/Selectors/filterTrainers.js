export const filterTrainer = (state) => {
    return state.trainerList.filter( trainer => ( trainer.city.toLowerCase().includes(state.city.toLowerCase())) );
};