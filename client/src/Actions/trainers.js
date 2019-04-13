// TRAINERS FETCHED
// ----------------------------------------------------------------------------
export const trainersFetched = (trainerList) => ({
    type : 'TRAINER_LIST_FETCHED',
    trainerList
})

// TRAINER SEARCH CHANGED
// ----------------------------------------------------------------------------
export const trainerSearchChanged = (input) => ({
    type : 'TRAINER_SEARCH_CHANGED',
    input
})
