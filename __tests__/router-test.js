var Router = require('../build/router.min');
var parseUrl = require('simple-url').parse;

const router = new Router();

function createUrlObj(url) {
  var urlObj = parseUrl(url);
  urlObj.url = url;
  return urlObj;
}

const testCases = [
  {
    testStrict: true,
    route: '/foo/bar/',
    url: '/foo/bar',
    request: {
      url: createUrlObj('/foo/bar'),
      params: null,
      data: undefined
    }
  },
  {
    testStrict: true,
    route: '/foo/:name/bar',
    url: '/foo/jimmy/bar/',
    request: {
      url: createUrlObj('/foo/jimmy/bar/'),
      params: {
        name: 'jimmy'
      },
      data: undefined
    }
  },
  {
    route: '/foo/**',
    url: '/foo/bar/foo',
    request: {
      url: createUrlObj('/foo/bar/foo'),
      params: {
        0: 'bar/foo'
      }
    }
  }
];

testCases.forEach(test => {
  router.create(test.route, (request) => {
    it(`'${test.url}' match ${test.route}`, () => {
      expect(request).toEqual(test.request);
    });
  });
  if(test.useStrict){
    router.create(test.route, (request) => {
      it(`'${test.url}' match strict ${test.route}`, () => {
        expect(request).toBe(undefined);
      });
    }, true);
  }
});

testCases.forEach(test => {
  router.match(test.url);
});


router.createMismatch((request) => {
  it('test mismatch', () => {
    expect(request)
      .toEqual({
        url: createUrlObj('/nothing'),
        data: 'some data'
      });
  });
});

router.match('/nothing', 'some data');
