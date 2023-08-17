const vader = require('vader-sentiment')

const input = 'Yes ,I consume it daily';
const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(input);
console.log(input, "  ------->  " , intensity);

// async function getsda(){
//     const questions = require('./assets/questions-addiction.json')
//     questions.intro.map((q) => {
//         console.log(q.question);
//         console.log(q.sense);
//     })
// }

// getsda().then(()=>{
//     console.log("success");
// })
