"use strict";

var CompiledRoutePaths = {};

var tokenRegex = /\(|\*\*|\*|:[^/)]*|\)/g;

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function _compile(routePath, strict) {
  var match,
      lastIndex = 0,
      pattern = "",
      token,
      tokens = [];
  while ((match = tokenRegex.exec(routePath)) !== null) {
    if (match.index !== lastIndex) {
      pattern += escapeRegExp(routePath.slice(lastIndex, match.index));
    }
    token = match[0];
    if (token[0] === ":") {
      pattern += '([^/]*)';
      tokens.push(token);
    } else if (token === "**") {
      pattern += "(.*)";
      tokens.push(token);
    } else if (token === "*") {
      pattern += "(.*?)";
      tokens.push(token);
    } else if (token === "(") {
      pattern += '(?:';
    } else if (token === ")") {
      pattern += ')?';
    }
    lastIndex = tokenRegex.lastIndex;
  }
  pattern += escapeRegExp(routePath.slice(lastIndex));
  pattern = strict === true ? pattern : pattern.slice(-1) === "/" ? pattern + "?" : pattern + "/?";
  pattern += "$";
  return {
    regex: new RegExp(pattern),
    tokens: tokens
  };
}

module.exports = {
  compile: function compile(routePath, strict) {
    var compiled,
        pathIndex = routePath + (strict || '');
    compiled = CompiledRoutePaths[pathIndex] || _compile(routePath, strict);
    return CompiledRoutePaths[pathIndex] = compiled;
  },
  parsePath: function parsePath(pathMatch, tokens) {
    var params = {},
        paramIndex = 0;
    tokens.forEach(function (token, index) {
      if (token[0] === ":") {
        params[token.slice(1)] = pathMatch[index + 1];
      } else {
        params[paramIndex] = pathMatch[index + 1];
        paramIndex++;
      }
    });
    return params;
  }
};