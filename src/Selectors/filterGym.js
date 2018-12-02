export const filterGym = (state) => {
    console.log("Lista siłowni: ",state.gymList);
    return state.gymList.filter( gym => ( gym.city.toLowerCase().includes(state.city.toLowerCase())) );

};