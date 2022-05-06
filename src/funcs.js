function processForm(responsesDict){

  Logger.log("Checking for Form Data:")

    if (responsesDict){
      Logger.log("Found Form Data!")
      var keys = Object.keys(responsesDict);

      // for each key, our callback function will assign the value of the key to a key within the template
      keys.forEach(function(key){
        Logger.log(templateArgsObject[key]);
      });
  } //End If


    // for (var key in responsesDict){
    //   var value = responsesDict[key];
    //   Logger.log(value)
    // 
    // if (key == "business_txt"){
    //   business = value    
    // }
    // else if (key == "email_txt"){
    //   email = value    
    // }
    // else{
    //   keyList.push(key)
    // }
    // }  
  
}
