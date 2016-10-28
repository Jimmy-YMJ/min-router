# mini-routerjs
A very basic router with functionalities of parsing route and registering callbacks for browser and nodejs.

## Installing
Use via npm:
```bash
npm install mini-routerjs
```
```javascript
var router = require('mini-routerjs');

// Use es6 import
import router from 'mini-routerjs';
```
Use in browser:

Scripts for browser is under [build](https://github.com/Jimmy-YMJ/mini-routerjs/tree/master/build) directory, use `router.js` for development (contains inline source maps) or use `router.min.js` for production. The reference in browser is `window.miniRouter`.

## Examples

Create a common route:
```javascript
var router = require('mini-routerjs');

router.create('/foo/:name/bar', function(request){
  console.log(request);
});

router.match('http://hostname/foo/jimmy/bar', 'some data');
/**
* Console output:
*{ url: 
*   { protocol: 'http',
*     auth: '',
*     host: 'hostname',
*     pathname: '/foo/jimmy/bar',
*     query: {},
*     hash: '' },
*  params: { name: 'jimmy' },
*  data: 'some data' }
*/

router.match('/foo/jimmy/bar?foo=bar', 'some data');
/**
* Console output:
*{ url: 
*   { protocol: '',
*     auth: '',
*     host: '',
*     pathname: '/foo/jimmy/bar',
*     query: {foo: 'bar'},
*     hash: '' },
*  params: { name: 'jimmy' },
*  data: 'some data' }
*/
```

Create a mismatch route:
```javascript
var router = require('mini-routerjs');

router.createMismatch(function(request){
  console.log(request);
});

router.match('/no-match', 'some data');
/**
* Console output:
*{ url: 
*   { protocol: '',
*     auth: '',
*     host: '',
*     pathname: '/no-match',
*     query: {},
*     hash: '' },
*  params: null,
*  data: 'some data' }
*/
```

## methods
### router.create(route, callback, strict)

| **Params** | **Type** | **Description** |
| --- | --- | --- |
| route | `String` |  The route pattern. |
| callback | `Function` | The callback which will be called when the route is matched, default `function(){}` |
| strict | `Boolean` | Enable strict routing. `false` by default, '/foo' and '/foo/' are treated the same by the router. |

When a **route** is matched, the corresponding **callback** will be passed a **request** param and executed. The **request** param has a structure like:
```javascript
{
  url: url, // A parsed url object which matchs this route.
  params: params, // The params extracted from url.
  data: data // The data passed by match method.
}
```
Url is parsed by [simple-url](https://github.com/Jimmy-YMJ/simple-url).

The **route** support following patterns:
- `*` will match any none '/' characters no greedy, the matched part will be indexed as the order of all `*` and `**`.
- `**` will match any characters, the matched part will be indexed as the order of all `*` and `**`.
- `:name` will match a part of none '/' characters, the matched part will be indexed as 'name'.
- `()` will make the part between it optional.

| **Route** | **url** | **params** |
| --- | --- | --- |
| `/foo/*.gif` | `/foo/hello.gif` | `{'0': 'hello'}` |
| `/foo/**` | `/foo/bar/hello` | `{'0': 'bar/hello'}` |
| `/foo/**/*.gif` | `/foo/bar/hello.gif` | `{'0': 'bar', '1': 'hello'}` |
| `/foo/:bar/hello` | `/foo/bar/hello` | `{'bar': 'bar'}` |
| `/foo/:bar/*.gif` | `/foo/bar/hello.gif` | `{'bar': 'bar', '0': 'hello'}` |
| `/foo/(:bar/hello)` | `/foo/bar/hello` | `{'bar': 'bar'}` |
| `/foo/(:bar/hello)` | `/foo/` | `{'bar': undefined}` |

### router.match(url, data)
Do a match with **url** and pass **data** to callback.

### router.createMissmatch(callback);
Create a missmatch, the **callback** will be called with a **request** param when any match is failed.

## License
MIT
