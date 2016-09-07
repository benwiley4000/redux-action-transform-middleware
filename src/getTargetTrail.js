const getTargetTrail = (target) => (
  target
    .split('.')
    .reduce((memo, t) => {
      // Filter for truthiness so empty strings get removed.
      const [first, ...rest] = t.split(/[\[\]]+/).filter(prop => prop);
      /* The first property doesn't need to be parsed.
       * The rest are assumed be either integers or strings,
       * delineated by single- or double-quotes.
       * Other types aren't supported, in order to make
       * things simpler.
       */
      memo.push(first);
      memo.push(...rest.map(prop => (
        isNaN(prop) ? prop.slice(1, -1) : parseInt(prop)
      )));
      return memo;
    }, [])
);

export default getTargetTrail;
