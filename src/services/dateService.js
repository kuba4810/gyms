
// Formatuje date usuwając zbędne oznaczenia
// Przykład: 2018-12-20T13:52:46.034Z zamienia na 2018-12-20 13:52:46
export const formatDate = (date) =>{
     return `${date.slice(0,10)} ${date.slice(11,19)}`    
}