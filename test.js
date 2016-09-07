import test from 'tape';
import recursiveJSONKeyTransform from 'recursive-json-key-transform';
import { createStore, applyMiddleware } from 'redux';

import getTargetTrail from './src/getTargetTrail';
import targetTransform from './src/targetTransform';
import actionTransformMiddleware from './src';

const upperCaseKeys = recursiveJSONKeyTransform(str => str.toUpperCase());

test('getTargetTrail works for deeply nested object properties.', t => {
  t.plan(1);

  t.deepEqual(getTargetTrail('a.b.c.d'), ['a', 'b', 'c', 'd']);
});

test('getTargetTrail works for deeply nested array indices.', t => {
  t.plan(1);

  t.deepEqual(getTargetTrail('a[1][3][2]'), ['a', 1, 3, 2]);
});

test('getTargetTrail works for array indices together with object properties.', t => {
  t.plan(1);

  t.deepEqual(getTargetTrail('a.b[1].c[3][2]'), ['a', 'b', 1, 'c', 3, 2]);
});

test('targetTransform works.', t => {
  t.plan(1);

  const obj = {
    a: {
      b: {
        c: {
          d: 7
        }
      }
    }
  };

  const desired = {
    A: {
      B: {
        C: {
          D: 7
        }
      }
    }
  };

  const transformed = targetTransform(obj, upperCaseKeys, []);

  t.deepEqual(transformed, desired);
});

test('targetTransform works for deeply nested object properties.', t => {
  t.plan(1);

  const obj = {
    a: {
      b: {
        c: {
          d: 7
        }
      }
    }
  };

  const desired = {
    a: {
      b: {
        C: {
          D: 7
        }
      }
    }
  };

  const transformed = targetTransform(obj, upperCaseKeys, ['a', 'b']);

  t.deepEqual(transformed, desired);
});

test('targetTransform works for deeply nested array indices.', t => {
  t.plan(1);

  const obj = [
    [{ a: 7 }],
    [
      [
        [{ b: 3 }],
        [{ c: 5 }]
      ],
      []
    ]
  ];

  const desired = [
    [{ a: 7 }],
    [
      [
        [{ B: 3 }],
        [{ C: 5 }]
      ],
      []
    ]
  ];

  const transformed = targetTransform(obj, upperCaseKeys, [1, 0]);

  t.deepEqual(transformed, desired);
});

test('targetTransform works for array indices together with object properties.', t => {
  t.plan(1);

  const obj = {
    a: {
      b: [
        {},
        {
          c: [
            [],
            [1, 2, 3],
            {},
            [
              {},
              {},
              {
                d: 7
              }
            ]
          ]
        }
      ]
    }
  };

  const desired = {
    a: {
      b: [
        {},
        {
          C: [
            [],
            [1, 2, 3],
            {},
            [
              {},
              {},
              {
                D: 7
              }
            ]
          ]
        }
      ]
    }
  };

  const transformed = targetTransform(obj, upperCaseKeys, ['a', 'b', 1]);

  t.deepEqual(transformed, desired);
});

test('targetTransform creates a new object.', t => {
  t.plan(1);

  const obj = {
    a: {
      b: {
        c: {
          d: 7
        }
      }
    }
  };

  const transformed = targetTransform(obj, upperCaseKeys, ['a', 'b']);

  t.notEqual(obj, transformed);
});

test('Middleware transforms specified target on dispatched actions.', t => {
  t.plan(1);

  const reducer = (state, action) => {
    switch (action.type) {
      case 'SOME_ACTION':
        t.ok(action.payload.A, 'Target keys are transformed.');
        break;
      default:
        break;
    }
    return state;
  };

  const upperCaseMiddleware = actionTransformMiddleware(
    'payload',
    upperCaseKeys
  );

  const store = createStore(reducer, {}, applyMiddleware(upperCaseMiddleware));

  store.dispatch({
    type: 'SOME_ACTION',
    payload: { a: true }
  });
});

test('Middleware transforms target only on allowedActions if specified.', t => {
  t.plan(2);

  const reducer = (state, action) => {
    switch (action.type) {
      case 'SOME_ACTION':
        t.ok(action.payload.A, 'Allowed actions are transformed.');
        break;
      case 'SOME_OTHER_ACTION':
        t.notOk(action.payload.A, 'Other actions are not transformed.');
        break;
      default:
        break;
    }
    return state;
  };

  const upperCaseMiddleware = actionTransformMiddleware(
    'payload',
    upperCaseKeys,
    { allowedActions: ['SOME_ACTION'] }
  );

  const store = createStore(reducer, {}, applyMiddleware(upperCaseMiddleware));

  store.dispatch({
    type: 'SOME_ACTION',
    payload: { a: true }
  });

  store.dispatch({
    type: 'SOME_OTHER_ACTION',
    payload: { a: true }
  });
});

test('Middleware ignores target on excludedActions if specified.', t => {
  t.plan(2);

  const reducer = (state, action) => {
    switch (action.type) {
      case 'SOME_ACTION':
        t.notOk(action.payload.A, 'Excluded actions are ignored.');
        break;
      case 'SOME_OTHER_ACTION':
        t.ok(action.payload.A, 'Other actions are transformed as usual.');
        break;
      default:
        break;
    }
    return state;
  };

  const upperCaseMiddleware = actionTransformMiddleware(
    'payload',
    upperCaseKeys,
    { excludedActions: ['SOME_ACTION'] }
  );

  const store = createStore(reducer, {}, applyMiddleware(upperCaseMiddleware));

  store.dispatch({
    type: 'SOME_ACTION',
    payload: { a: true }
  });

  store.dispatch({
    type: 'SOME_OTHER_ACTION',
    payload: { a: true }
  });
});

test('Middleware overrides allowedActions with excludedActions.', t => {
  t.plan(1);

  const reducer = (state, action) => {
    switch (action.type) {
      case 'SOME_ACTION':
        t.notOk(action.payload.A, 'Excluded actions ignored even if explicitly allowed.');
        break;
      default:
        break;
    }
    return state;
  };

  const upperCaseMiddleware = actionTransformMiddleware(
    'payload',
    upperCaseKeys,
    { allowedActions: ['SOME_ACTION'], excludedActions: ['SOME_ACTION'] }
  );

  const store = createStore(reducer, {}, applyMiddleware(upperCaseMiddleware));

  store.dispatch({
    type: 'SOME_ACTION',
    payload: { a: true }
  });
});
