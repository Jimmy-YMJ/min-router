const routeCompiler = require('./lib/route-compiler');
const urlUtils = require('simple-url');

const regexRouters = [];
const stringRouters = {};
var emptyFunc = () => {};
var onMismatch;

module.exports = {
  createMismatch: mismatch => {
    onMismatch = mismatch || emptyFunc;
  },
  create: (route, callback, strict) => {
    callback = callback || emptyFunc;
    var compiled = routeCompiler.compile(route, strict);
    if(compiled.tokens.length === 0){
      stringRouters[route] = callback;
      if(strict !== true){
        stringRouters[route.slice(-1) === "/" ? route.slice(0, -1) : route + "/"] = callback;
      }
    }else{
      regexRouters.push([compiled, callback]);
    }
  },
  match: (url, data) => {
    var urlObj = urlUtils.parse(url),
      path = urlObj.pathname;
    urlObj.url = url;
    if(stringRouters[path]){
      stringRouters[path]({url: urlObj, params: null, data: data});
      return true;
    }else{
      var i = 0, len = regexRouters.length, router, match;
      while(i < len){
        router = regexRouters[i];
        match = router[0].regex.exec(path);
        if(match !== null){
          router[1]({url: urlObj, params: routeCompiler.parsePath(match, router[0].tokens), data: data});
          return true;
        }
        i ++;
      }
    }
    onMismatch({url: urlObj, data: data});
    return false;
  }
};
