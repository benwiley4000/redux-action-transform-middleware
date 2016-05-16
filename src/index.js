import varVal from 'var-validator';

const targetTransform = (obj, transformer, targetsRemaining) => {
  if (targetsRemaining.length === 0) {
    return transformer(obj);
  }
  const nextTarget = targetsRemaining[0];
  const {
    [nextTarget]: nextObj,
    ...rest
  } = obj;
  if (!nextObj) {
    return obj;
  }
  return {
    [nextTarget]: targetTransform(
      nextObj,
      transformer,
      targetsRemaining.slice(1)
    ),
    ...rest
  };
};

const actionTransformMiddleware = (target, transformer, actionTypes) => {
  const errors = [];
  const targetTrail = target.split('.');
  if (
    targetTrail.indexOf('') !== -1 ||
    targetTrail.some(varName => !varVal.isValid(varName))
  ) {
    errors.push('Invalid target location specified.');
  }
  if (typeof transformer !== 'function') {
    errors.push('Supplied transformer is not a function.');
  }
  if (errors.length) {
    errors.forEach(console.error.bind(console));
    throw new Error('Unable to create action transform middleware.');
  }

  return store => next => action => {
    if (actionTypes && actionTypes.indexOf(action.type) === -1) {
      return next(action);
    }
    next(targetTransform(action, transformer, targetTrail));
  };
};

module.exports = actionTransformMiddleware;
