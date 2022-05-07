function processForm(formData, business, email){
  // Set the details for the Spreadsheet we need to read the scoring from - Global in Code.js

  // const questionDbSpreadsheetID = "1A4tcVFfLhbYixQ6UuBGaX35QS7r2FK5xCb6pMqKohF4"
  const scoreSheet = SpreadsheetApp.openById(questionDbSpreadsheetID)
  
  // Get the values from the relevant Named Ranges
  // QuestionScoring is a table with the following array:
  //   [0]    |    [1]     |   [2]  |    [3]    |      [4]       |     [5]   |
  // Question |  HTMLName  | Scores |  Section  |  SectionScore  |   Answer  |
  const questionScoring = scoreSheet.getRangeByName("QuestionScoresRange").getValues()

  var rankingDict = {}
  var questionAnswer = {}

  for (var htmlQuestion in formData){
    // returns 2 values, one of the new rankedDict, one of the specific question's answer
    rankedResponse = scoreQuestion(htmlQuestion, questionScoring, rankingDict)
    rankingDict = rankedResponse[0]
    questionAnswer[htmlQuestion] = rankedResponse[1]

  }
  Logger.log("Let's find the highest impact!")
  var rankedQs = findHighestImpact(rankingDict)
  Logger.log(rankedQs)

  // displayAnswers(rankedQs, questionAnswer)
}


function scoreQuestion(inputQuestion, scoringMetric, questionDict){
  for (var j=0; j < scoringMetric.length; j++){
    // Find the question by HTML name
    if (scoringMetric[j][1] == inputQuestion){
      // Found the relevant question via its HTML code!
    
      // Set the values we found

      // Score of the specific question
      var responseScore = scoringMetric[j][2];
      
      // Score of the quesiton's section section
      var responseSectionScore = scoringMetric[j][4];

      // Pre-written Answer for each question
      var responseAnswer = scoringMetric[j][5];
      var totalScore = responseScore * responseSectionScore;
      questionDict[inputQuestion] = totalScore

      // We return a list so we can include the Answer, and then separate them out on the other end
      return [questionDict, responseAnswer]
    }
  }
}

function findHighestImpact(impactDict){
  // Creates a list based on the values of the impactDict
  // it sorts them based on the value, takes the top 3, and returns the keys for those
  const highestImp = Object
  .entries(impactDict)
  .sort(([, a],[, b]) => b-a) // sort by value, descending (b-a)
  .slice(0,3) // return only the first 3 elements of the intermediate result
  .map(([n])=> n); // and map that to an array with only the name

  Logger.log(highestImp)
  return highestImp
}

// function displayAnswers(rankedQuestions, scoringAnswers){
//   // Iterating over the ranked quesions, we find their answers based on the list
//   // we passed backwards in the scoreQuestion function
//   for (var i = 0; i < rankedQuestions.length; i++ ){
//     for (var key in scoringAnswers){
//       if (rankedQuestions[i] == key){
//         Logger.log("Answer for %s: ", rankedQuestions[i])
//         Logger.log(scoringAnswers[key])
//       }
//     }
//   }

// }