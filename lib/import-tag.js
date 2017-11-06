// Imports
const fs = require('fs');
const path = require('path');

// Top level file path
let filePath = '';

/**
 * Transforms HTML by inserting static HTML content in place of custom import tags
 * @param {string} path Path to HTML file to compile
 */
async function importTag(path) {
  // Store the path
  filePath = path;

  // Read the HTML file contents
  let html = await new Promise(resolve => {
    fs.readFile( path, { encoding: 'utf8' }, (err, file) => {
      resolve(file);
    });
  });

  // Compile if found
  if (html) {
    return compile(html);
  } else {
    throw new Error('File not found!');
  }
}

/**
 * Perform HTML import tag resolution
 * @param {string} html HTML file contents containing an import tag to transform
 */
async function compile(html) {
  // RegEx's
  let importTagExpression = /(<import)([^>]+)>/g;
  let srcExpression = /(src=")[\s\S]+"/g;

  // Keep all matches
  let matches = [];

  // Current match
  let currentMatch;

  // Search for all import tags
  while (currentMatch = importTagExpression.exec(html)) {
    matches.push(currentMatch[0]);
  }

  // Remove duplicates
  let uniqueMatches = [];
  matches.forEach(match => {
    if (uniqueMatches.indexOf(match) === -1) {
      uniqueMatches.push(match);
    }
  });

  // Iterate over each match
  for (let match of uniqueMatches) {
    // Find the src attribute
    let source = srcExpression.exec(match);

    if (!source) {
      throw new Error(`Could not parse source tag. Possible inifinite import loop: ${match}`);
    }

    // Extract the actual value
    let fixedSource = source[0].replace('src="', '');
    fixedSource = fixedSource.substring(0, fixedSource.length - 1);

    // Determine source of the file relative to the top-level html
    let importPath = path.join( path.dirname(filePath), fixedSource );

    // Read & compile the file
    let compiledHtmlContents = await importTag(importPath);

    // Replace all occurrences with compiled output
    html = html.replace(new RegExp(match, 'g'), compiledHtmlContents);
  }

  // Compiled!
  return html;
}

// Export
module.exports = importTag;
