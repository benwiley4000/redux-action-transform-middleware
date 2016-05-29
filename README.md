#redux-action-transform-middleware

Generates Redux middleware for applying a given transformer function to a given sub-object target on each dispatched action (if it exists). This target's key is specified as a string and can be deeply nested (e.g. 'res.data').

If the key isn't found, the unmodified action will be passed to the next middleware. If it is found, the transformed action will be passed instead.

##Installation (get it from [npm](https://www.npmjs.com/package/redux-action-transform-middleware))

```
npm install redux-action-transform-middleware
```

##Usage

```
actionTransformMiddleware(target, transformer [, options])
```

`target` is the key location of the sub-object to transform.

`transformer` is the function to be applied to the target.

`options.allowedActions` is a list of Redux action types that, if specified, will cause all other action types to be ignored by the middleware. If not specified, all dispatched actions will be transformed by default.

`options.excludedActions` is a list of Redux action types that will be explicitly filtered by the middleware. If an action type has also been specified in `allowedActions`, it will be excluded but a warning will also be printed to the console.

e.g.
```
const allCapsMiddleware = actionTransformMiddleware(
  'content',
  str => str.toUpperCase(),
  { allowedActions: ['TITLE_REQUEST', 'BODY_REQUEST'] }
);
```

The above middleware could be used to convert fetched content to all caps whenever a request is made for title or body content (one would assume, based on the action types).

##Full Example

A very simple yet complete Redux app is shown below, using `actionTransformMiddleware` and a simple transform function to check for an action property called `message.name`, and lowercase it before it is received by the reducer.

```
/**
 * ES6/ES2015 syntax
 */
import { createStore, applyMiddleware } from 'redux';
import actionTransformMiddleware from 'redux-action-transform-middleware';

const initialState = {
  name: 'fred'
};

const reducer = (state, action) => {
  state = state || {};
  switch(action.type) {
    case 'NAME_CHANGE':
      return {
        ...state,
        name: action.message.name
      };
    default:
      return state;
  }
};

const quietDown = (name) => name.toLowerCase();
const quietDownMiddleware = actionTransformMiddleware(
  'message.name',
  quietDown
);

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(quietDownMiddleware)
);

console.log(store.getState()); // { name: 'fred' }

store.dispatch({
  type: 'NAME_CHANGE',
  message: {
    name: 'AMANDA'
  }
});

console.log(store.getState()); // { name: 'amanda' }

```
