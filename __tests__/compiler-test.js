const compiler = require('../build/modules/lib/route-compiler');

const routeTests = [
  {
    route: '/foo/**',
    success: [
      '/foo/',
      '/foo/bar',
      '/foo/bar/foo'
    ],
    failure: [
      '/foo',
      'foo/',
      'foo'
    ]
  },
  {
    route: '/foo/*.gif',
    success: [
      '/foo/.gif',
      '/foo/a.gif'
    ],
    failure: [
      '/foo/gif'
    ]
  },
  {
    route: '/foo/:name',
    success: [
      '/foo/bar'
    ],
    failure: [
      '/foo/'
    ]
  },
  {
    route: '/foo/(*.gif)',
    success: [
      '/foo/',
      '/foo/a.gif'
    ],
    failure: [
      '/foo/bar'
    ]
  },
  {
    route: '/foo/**/*.gif',
    success: [
      '/foo/bar/a.gif',
      '/foo/bar/foo/a.gif'
    ],
    failure: [
      '/foo/a.gif'
    ]
  }
];

routeTests.forEach((test) => {
  var route = test.route,
    routeRegex = compiler.compile(route).regex;
  test.success.forEach(successCase => {
    it(`match '${successCase}' to '${route}'`, () => {
      expect(routeRegex.exec(successCase) !== null)
        .toBe(true);
    });
  });
});

it('test route compiler idempotent', () => {
  var count = 1, route = '/foo/:name/**/*.gif', expected = compiler.compile(route);
  while (count < 3){
    expect(compiler.compile('/foo/:name/**/*.gif'))
      .toEqual(expected);
    count ++;
  }
});
