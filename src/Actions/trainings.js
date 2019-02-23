
// EDIT MODE ACTIVE
// ---------------------------------------------------------------------------- 
export const editModeActive = () => ({
    type : 'EDIT_MODE_ACTIVE'
  })


// EDIT MODE DISABLED
// ---------------------------------------------------------------------------- 
export const editModeDisabled = () => ({
  type : 'EDIT_MODE_DISABLED'
})
  

// TRAINING CHOOSEN
// ---------------------------------------------------------------------------- 
export const trainingChoosen = (training) => ({
  type : 'TRAINING_CHOOSEN',
  training
})