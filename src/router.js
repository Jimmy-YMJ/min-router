const routeCompiler = require('./lib/route-compiler');
const urlUtils = require('simple-url');
var emptyFunc = () => {};

function Router(){
  this.regexRouters = [];
  this.stringRouters = {};
  this.onMismatch = emptyFunc;
}

Router.prototype = {
  createMismatch: function(mismatch){
    if(typeof mismatch === 'function'){
      this.onMismatch = mismatch;
    }
  },
  create: function(route, callback, strict){
    callback = callback || emptyFunc;
    var compiled = routeCompiler.compile(route, strict);
    if(compiled.tokens.length === 0){
      this.stringRouters[route] = callback;
      if(strict !== true){
        this.stringRouters[route.slice(-1) === "/" ? route.slice(0, -1) : route + "/"] = callback;
      }
    }else{
      this.regexRouters.push([compiled, callback]);
    }
  },
  match: function(url, data){
    var urlObj = urlUtils.parse(url),
      path = urlObj.pathname;
    urlObj.url = url;
    if(this.stringRouters[path]){
      this.stringRouters[path]({url: urlObj, params: null, data: data});
      return true;
    }else{
      var i = 0, len = this.regexRouters.length, router, match;
      while(i < len){
        router = this.regexRouters[i];
        match = router[0].regex.exec(path);
        if(match !== null){
          router[1]({url: urlObj, params: routeCompiler.parsePath(match, router[0].tokens), data: data});
          return true;
        }
        i ++;
      }
    }
    this.onMismatch({url: urlObj, data: data});
    return false;
  }
};

module.exports = Router;
