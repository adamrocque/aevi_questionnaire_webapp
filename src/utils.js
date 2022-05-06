function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Building a render function to take arguments of template file and the arguments to render it with
function render(file, templateArgsObject){
  // Initialize the template
  var webTemplate =  HtmlService.createTemplateFromFile(file);

  // If arguments were passed, get the keys from the arguments
  if (templateArgsObject){
    var keys = Object.keys(templateArgsObject);

    // for each key, our callback function will assign the value of the key to a key within the template
    keys.forEach(function(key){
      webTemplate[key] = templateArgsObject[key];
    });
  } //End If
  return webTemplate.evaluate();
}