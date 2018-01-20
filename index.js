#!/usr/bin/env node
'use strict';

var fs = require('fs');
var commander = require('commander');
var HTMLtoJSX = require('htmltojsx');

commander
  .usage('file[.html] [ComponentName]')
  .version('0.0.1')
  //.option('-r, --redux', 'Generate Redux component')
  .parse(process.argv);

var inputFile = process.argv[2];

if (!inputFile) {
  console.error("Enter html file name your want to convert.");
  process.exit(2);
}

if (inputFile.indexOf('.html') === -1) {
  inputFile = inputFile + '.html';
}

var component =  process.argv[3];
if (!component) {
  component = inputFile;
  component = component.replace('.html', '');
  component = component.substr(0, 1).toUpperCase() + component.substring(1);
}

fs.readFile(inputFile, 'utf-8', function(err, input) {
  if (err) {
    console.error("Error opening file " + inputFile + ".");
    process.exit(2);
  }
  var converter = new HTMLtoJSX({
    createClass: false,
    outputClassName: component
  });
  var output = converter.convert(input);
  output = output.split("\n").map(function(line) {
    return "      " + line;
  }).join("\n");
  output = "import React, {Component} from 'react';\n"
    + "\n"
    + "class "+ component +" extends Component {\n"
    + "\n"
    + "  render() {\n"
    + "    return (\n"
    + output.trimRight()
    + "\n"
    + "    );\n"
    + "  }\n"
    + "\n"
    + "}\n"
    + "\n"
    + "export default " + component +";";

  fs.writeFile(component + ".js", output, function(err) {
    if(err) {
      console.error(err);
      process.exit(2);
    }
    console.log(component + " component generated.");
  });
});