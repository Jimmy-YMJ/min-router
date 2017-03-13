const routeCompiler = require('./route-compiler');
const simpleUrl = require('simple-url');
var emptyFunc = () => {};

function Router(options){
  options = options || {};
  this.strict = !!options.strict || false;
  this.parseQuery = !!options.parseQuery || true;
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
    strict = typeof strict === 'boolean' ? strict : this.strict;
    callback = callback || emptyFunc;
    var compiled = routeCompiler.compile(route, strict);
    if(compiled.tokens.length === 0){
      this.stringRouters[route] = callback;
      if(strict !== true){
        this.stringRouters[route.slice(-1) === "/" ? route.slice(0, -1) : route + "/"] = callback;
      }
    }else{
      this.regexRouters.push([compiled, callback, route]);
    }
  },
  match: function(url, data){
    var urlObj = simpleUrl.parse(url, this.parseQuery),
      path = urlObj.pathname;
    urlObj.url = url;
    if(this.stringRouters[path]){
      this.stringRouters[path]({
        pattern: path,
        url: urlObj,
        params: null,
        data: data
      });
      return true;
    }else{
      var i = 0, len = this.regexRouters.length, router, match;
      while(i < len){
        router = this.regexRouters[i];
        match = router[0].regex.exec(path);
        if(match !== null){
          router[1]({
            pattern: router[2],
            url: urlObj,
            params: routeCompiler.parsePath(match, router[0].tokens),
            data: data
          });
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
