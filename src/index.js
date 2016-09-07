import varVal from 'var-validator';

import getTargetTrail from './getTargetTrail';
import targetTransform from './targetTransform';
import isArray from './isArray';

const actionTransformMiddleware = (target, transformer, options) => {
  options = options || {};
  const allowedActions = options.allowedActions;
  const excludedActions = options.excludedActions;

  const errors = [];
  const targetTrail = getTargetTrail(target);
  if (
    targetTrail.indexOf('') !== -1 ||
    targetTrail.some(varName => !varVal.isValid(varName))
  ) {
    errors.push('Invalid target location specified.');
  }
  if (typeof transformer !== 'function') {
    errors.push('Supplied transformer is not a function.');
  }
  if (allowedActions && !isArray(allowedActions)) {                           
    errors.push('Specified `allowedActions` parameter is not an array.');
  }
  if (excludedActions && !isArray(excludedActions)) {                           
    errors.push('Specified `excludedActions` parameter is not an array.');
  }
  if (errors.length) {
    errors.forEach(console.error.bind(console));
    throw new Error('Unable to create action transform middleware.');
  }

  return store => next => action => {
    if (allowedActions && allowedActions.indexOf(action.type) === -1) {
      return next(action);
    }
    if (excludedActions && excludedActions.indexOf(action.type) !== -1) {
      if (allowedActions) {
        console.warn('Excluding action ' + action.type + ' from transform middleware, though it was specified both as excluded and allowed. Please fix conflict.');
      }
      return next(action);
    }
    next(targetTransform(action, transformer, targetTrail));
  };
};

module.exports = actionTransformMiddleware;
