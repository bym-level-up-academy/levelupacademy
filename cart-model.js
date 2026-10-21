(function (root) {
  const catalog = Object.freeze({
    mindset: {title:'Formation mindset', price:199700, image:'/assets/50180fa349af5fe39166.jpg', url:'/products/formation-mindset'},
    immobilier: {title:'Acheter sa résidence principale en toute sécurité', price:199700, image:'/assets/9c478c6e1dfdc152cfa7.png', url:'/products/formation-immo'}
  });
  function clean(value) {
    const state = {};
    for (const key of Object.keys(catalog)) {
      const n = value?.[key];
      if (Number.isSafeInteger(n) && n > 0) state[key] = Math.min(99, n);
    }
    return state;
  }
  function change(state, key, delta) {
    const next = clean(state);
    if (!Object.hasOwn(catalog, key) || !Number.isSafeInteger(delta)) return next;
    const qty = Math.max(0, Math.min(99, (next[key] || 0) + delta));
    if (qty) next[key] = qty; else delete next[key];
    return next;
  }
  function totals(state) {
    return Object.entries(clean(state)).reduce((sum,[key,qty]) => ({count:sum.count+qty, amount:sum.amount+catalog[key].price*qty}), {count:0,amount:0});
  }
  const model = {catalog,clean,change,totals};
  if (typeof module !== 'undefined') module.exports = model; else root.DemoCartModel = model;
})(globalThis);
