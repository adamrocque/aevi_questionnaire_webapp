function getResults(){
    Utilities.sleep(1000)
    var dbSpreadsheet = SpreadsheetApp.openById(questionDbSpreadsheetID)
    var workingSheet = dbSpreadsheet.getSheetByName('FORM DATA');
    //   // This gets all the data in the sheet, starting from A1,
    //   // getValues shows this table as a 2D array, 1D is each row, 2D is the elements in the Rows
    //   var list = ws.getRange(1,1,ws.getRange("A1").getDataRegion().getLastRow(),).getValues();

    var responseRow = workingSheet.getLastRow();  
    var responseColumns = workingSheet.getMaxColumns();
    var responseList = workingSheet.getRange(responseRow, 1, 1, responseColumns).getValues();

    var answerList = responseList.slice(-6);

    Logger.log("Got some results:")
    Logger.log(answerList[0])
    return answerList[0]
}