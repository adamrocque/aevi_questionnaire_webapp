function waitForExcel(){
    var dbSpreadsheet = SpreadsheetApp.openById(questionDbSpreadsheetID)
    var workingSheet = dbSpreadsheet.getSheetByName('FORM DATA');
    var sheetReady = dbSpreadsheet.getRangeByName("SheetReady")
    
    var responseRow = "";
    var responseColumns = "";
    var responseList = "";
  
    while (sheetReady.getValue() != "YES"){
      responseRow = workingSheet.getLastRow();  
      responseColumns = workingSheet.getMaxColumns();
      responseList = workingSheet.getRange(responseRow, 1, 2, responseColumns).getValues();
      sheetReady = workingSheet.getRangeByName("SheetReady");    
    }
    
    getQuestionResponsesTest()

    sheetReady.setValue("No")
}

function getQuestionResponsesTest(){
    var dbSpreadsheet = SpreadsheetApp.openById(questionDbSpreadsheetID)
    var workingSheet = dbSpreadsheet.getSheetByName('FORM DATA');
    
    var responseRow = workingSheet.getLastRow();
    var responseColumns = workingSheet.getMaxColumns();
    var responseList = workingSheet.getRange(responseRow, 1, 2, responseColumns).getValues();
    
    Logger.log("Returning the data from Excel")
    Logger.log(responseList)
    sheetReady.setValue("NO")
    
    return responseList
  
  }