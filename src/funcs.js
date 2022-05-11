function processForm(formData, business, email){
  // Set the details for the Spreadsheet we need to read the scoring from - Global in Code.js

  // const questionDbSpreadsheetID = "1A4tcVFfLhbYixQ6UuBGaX35QS7r2FK5xCb6pMqKohF4"
  const scoreSheet = SpreadsheetApp.openById(questionDbSpreadsheetID)
  const dataSheet = scoreSheet.getSheetByName('FORM DATA');
  
  // Get the values from the relevant Named Ranges
  // QuestionScoring is a table with the following array:
  //   [0]    |    [1]     |   [2]  |    [3]    |      [4]       |     [5]   |
  // Question |  HTMLName  | Scores |  Section  |  SectionScore  |   Answer  |
  const questionScoring = scoreSheet.getRangeByName("QuestionScoresRange").getValues()

  var rankingDict = {}
  var questionAnswer = {}
  var questionFull = {}

  var questionList = []
  var answerList = []

  for (var htmlQuestion in formData){
    // returns 2 values, one of the new rankedDict, one of the specific question's answer
    questionList.push(htmlQuestion);
    answerList.push(formData[htmlQuestion]);
    
    rankedResponse = scoreQuestion(htmlQuestion, formData[htmlQuestion], questionScoring, rankingDict)

    rankingDict = rankedResponse[0]
    questionAnswer[htmlQuestion] = rankedResponse[1]
    questionFull[htmlQuestion] = rankedResponse[2]
  }
  
  for (var key in rankingDict){
    Logger.log("Ranking Dict[" + key + "]: " + rankingDict[key] )
  }
  // TODO make this function only write to the DB
  // Create a new function that leads into the scoring and all the rest that's called from the next page
  
  questionList.unshift("Business", "Email", "Date")
  answerList.unshift(business, email, new Date())

  Logger.log("Let's find the highest impact!")
  var rankedQs = findHighestImpact(rankingDict)
  // Logger.log(rankedQs)

  var answerPairs = []
  var returnAnswers = displayAnswers(rankedQs, questionAnswer, questionFull);
  for (var htmlName in returnAnswers){
    // PropertiesService.getScriptProperties().setProperty(returnAnswers[htmlName][0], returnAnswers[htmlName][0])
    answerPairs.push(returnAnswers[htmlName][0])
    answerPairs.push(returnAnswers[htmlName][1])
  }
  dataSheet.appendRow([" ", " "])
  dataSheet.appendRow(questionList);
  dataSheet.appendRow(answerList)
  dataSheet.appendRow(answerPairs)
  var lastRowIndex = dataSheet.getLastRow();
  var lastAppendedRow = dataSheet.getRange(lastRowIndex, 1, 1, 6)

  scoreSheet.setNamedRange("QuestionResults", lastAppendedRow)

}


function scoreQuestion(inputQuestion, answer, scoringMetric, questionDict){
  for (var j=0; j < scoringMetric.length; j++){
    // Find the question by HTML name
    if (scoringMetric[j][1] == inputQuestion){
      // Found the relevant question via its HTML code!

      // Set the values we found
      var responseFullQuestion = scoringMetric[j][0];
      // Score of the specific question
      var responseScore = scoringMetric[j][2];
      
      // Score of the quesiton's section section
      var responseSectionScore = scoringMetric[j][4];

      // Pre-written Answer for each question
      var responseAnswer = scoringMetric[j][5];
      if (answer == "No"){
        var totalScore = responseScore * responseSectionScore;  
      }      
      else{
        var totalScore = 0
      }
      questionDict[inputQuestion] = totalScore

      // We return a list so we can include the Answer, and then separate them out on the other end
      return [questionDict, responseAnswer, responseFullQuestion]
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

  Logger.log("Highest Impact: " + highestImp)
  return highestImp
}

function displayAnswers(rankedQuestions, scoringAnswers, fullQuestion){
  // Iterating over the ranked quesions, we find their answers based on the list
  // we passed backwards in the scoreQuestion function
  var answerDict = {};
  for (var i = 0; i < rankedQuestions.length; i++ ){
    for (var key in scoringAnswers){
      if (rankedQuestions[i] == key){
        // Logger.log("Answer for %s is: \n%s ", 
        // fullQuestion[key],
        // scoringAnswers[key])
        answerDict[key]=[fullQuestion[key], scoringAnswers[key]]
      }
    }
  }
  return answerDict
}