import isArray from './isArray';

const targetTransform = (obj, transformer, targetsRemaining) => {
  if (targetsRemaining.length === 0) {
    return transformer(obj);
  }
  const nextTarget = targetsRemaining[0];
  const nextObj = obj[nextTarget];
  if (!nextObj) {
    return obj;
  }
  const newNextObj = targetTransform(
    nextObj,
    transformer,
    targetsRemaining.slice(1)
  );
  if (nextObj === newNextObj) {
    return obj;
  }
  const newObj = isArray(obj) ? [...obj] : { ...obj };
  newObj[nextTarget] = newNextObj;
  return newObj;
};

export default targetTransform;
