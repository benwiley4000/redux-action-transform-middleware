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
  const reformedObject = isArray(obj) ? [...obj] : { ...obj };
  reformedObject[nextTarget] = targetTransform(
    nextObj,
    transformer,
    targetsRemaining.slice(1)
  );
  return reformedObject;
};

export default targetTransform;
