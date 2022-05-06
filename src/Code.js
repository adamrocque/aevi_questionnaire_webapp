// Make the spreadsheet URL a global variable
var questionDbSpreadsheetID = "1A4tcVFfLhbYixQ6UuBGaX35QS7r2FK5xCb6pMqKohF4"
var Route = {}

Route.path = function(route, callback){
  Route[route]=callback;
}

function doGet(event){

  Route.path("form", loadForm)
  Route.path("home", loadHome)
  Route.path("result", loadResult)

  if(Route[event.parameters.v]){
    return Route[event.parameters.v]();
  }
  else{
    return render("home")
  }
  // Logger.log(event.parameters.v)
  // return loadPage(event.parameters.v);

}

function loadForm(){
  var dbSpreadsheet = SpreadsheetApp.openById(questionDbSpreadsheetID)

  // This gets all the data in the sheet, starting from A1,
  // getValues shows this table as a 2D array, 1D is each row, 2D is the elements in the Rows
  // var list = ws.getRange(1,1,ws.getRange("A1").getDataRegion().getLastRow(),).getValues();
  var qList = dbSpreadsheet.getRangeByName('QuestionList').getValues();
  var htmlList = dbSpreadsheet.getRangeByName('HTMLNameList').getValues();
  
  // We need a 1D array, so we map through the rows taking only the 1st column (0th) values
  var questionList = qList.map(function(r){ return r[0] });
  var htmlNameList = htmlList.map(function(r){ return r[0] });

  // Populate a dict that will pass to the Render function
  // The values in the dict will be made available in HTML for the templated page
  // We will use these to build the question radio buttons
  formArgs = {
    questionList: questionList,
    htmlNameList: htmlNameList,    
  }

  return render("form",formArgs)
}

function loadHome(){
  return render("home")
}

function loadResult(){
  return render("result")
}