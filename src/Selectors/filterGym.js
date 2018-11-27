export const filterGym = (state) => {

    return state.gymList.filter( gym => ( gym.contains(state.city)) );

};