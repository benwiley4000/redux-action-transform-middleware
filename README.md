#redux-action-transform-middleware

Generates Redux middleware for applying a given transformer function to a given target key on each dispatched action (if it exists). This key is specified as a string and can be deeply nested (e.g. 'res.data').

If the key isn't found, the unmodified action will be passed to the next middleware. If it is found, the transformed action will be passed instead.

##Installation (get it from [npm](https://www.npmjs.com/package/redux-action-transform-middleware))

```
npm install redux-action-transform-middleware
```

##Usage

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
      const { name, ...rest } = action;
      return {
        name: action.message.name,
        ...rest
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
