(() => {
  const {catalog,clean,change,totals} = window.DemoCartModel;
  const storageKey = 'level-up-demo-cart-v1';
  let state = {};
  try { state = clean(JSON.parse(sessionStorage.getItem(storageKey))); } catch {}
  const money = cents => new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(cents/100);
  const cart = document.createElement('dialog');
  cart.id = 'demo-cart';
  cart.className = 'demo-cart';
  cart.setAttribute('aria-labelledby','demo-cart-title');
  cart.innerHTML = `<div class="demo-cart-panel gradient color-scheme-1">
    <header class="demo-cart-header"><h2 id="demo-cart-title">Votre panier</h2><button type="button" class="demo-cart-close" data-close-cart aria-label="Fermer le panier">×</button></header>
    <div class="demo-cart-tag">Panier de démonstration</div>
    <div class="demo-cart-items"></div>
    <footer class="demo-cart-footer"><div class="demo-cart-total"><h3>Total estimé</h3><strong></strong></div><p class="demo-cart-note">Démonstration uniquement : aucune commande ni aucun paiement possible.</p><button type="button" class="button button--full-width" disabled>Procéder au paiement</button></footer>
  </div>`;
  document.body.append(cart);
  const live = document.createElement('div'); live.className='visually-hidden'; live.setAttribute('role','status'); document.body.append(live);
  const items = cart.querySelector('.demo-cart-items');
  let closing = false;
  function render() {
    const sum = totals(state);
    document.querySelectorAll('[data-cart-count]').forEach(x => { x.textContent = sum.count; x.hidden = !sum.count; });
    document.querySelectorAll('[data-open-cart]').forEach(x => x.setAttribute('aria-label',`Panier, ${sum.count} article${sum.count>1?'s':''}`));
    cart.querySelector('.demo-cart-total strong').textContent = money(sum.amount);
    cart.querySelector('.demo-cart-footer').hidden = !sum.count;
    if (!sum.count) {
      items.innerHTML='<div class="demo-cart-empty"><h2>Votre panier est vide</h2><a class="button" href="/levelupacademy/#formations" data-continue-shopping>Continuer les achats</a><p>Découvrez nos formations et ajoutez-les pour essayer le panier.</p></div>';
      return;
    }
    items.innerHTML = '<div class="demo-cart-columns"><span>Produit</span><span>Total</span></div>' + Object.entries(state).map(([key,qty]) => {
      const p=catalog[key];
      return `<article class="demo-cart-item" data-item="${key}"><a href="${p.url}" tabindex="-1" aria-hidden="true"><img src="${p.image}" alt="" width="85" height="85"></a><div><a class="demo-cart-product" href="${p.url}">${p.title}</a><p class="demo-cart-price">${money(p.price)}</p><div class="demo-cart-actions"><div class="demo-cart-quantity"><button type="button" data-delta="-1" data-key="${key}" aria-label="Diminuer la quantité de ${p.title}">−</button><output aria-label="Quantité">${qty}</output><button type="button" data-delta="1" data-key="${key}" aria-label="Augmenter la quantité de ${p.title}" ${qty===99?'disabled':''}>+</button></div><button type="button" class="demo-cart-remove" data-remove="${key}" aria-label="Retirer ${p.title}"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 5h14M7 5V3h6v2M5 5l1 12h8l1-12M8 8v6m4-6v6" stroke="currentColor" stroke-width="1.3"/></svg></button></div></div><strong class="demo-cart-line-total">${money(p.price*qty)}</strong></article>`;
    }).join('');
  }
  function save(message) { try { sessionStorage.setItem(storageKey, JSON.stringify(state)); } catch {} render(); live.textContent=message; }
  function open() { if (closing || cart.open) return; render(); cart.showModal(); document.body.classList.add('demo-cart-open'); requestAnimationFrame(() => cart.classList.add('is-open')); }
  function close() {
    if (!cart.open || closing) return;
    closing=true;cart.classList.remove('is-open');
    setTimeout(() => { cart.close();document.body.classList.remove('demo-cart-open');closing=false; },matchMedia('(prefers-reduced-motion: reduce)').matches?0:300);
  }
  cart.addEventListener('cancel',e => {e.preventDefault();close();});
  cart.addEventListener('click',e => {
    if (e.target === cart || e.target.closest('[data-close-cart]')) close();
    const delta=e.target.closest('[data-delta]'),remove=e.target.closest('[data-remove]');
    if (delta) {state=change(state,delta.dataset.key,Number(delta.dataset.delta));save('Quantité mise à jour.');cart.querySelector(`[data-key="${delta.dataset.key}"][data-delta="${delta.dataset.delta}"]`)?.focus();}
    if (remove) {const key=remove.dataset.remove;state=change(state,key,-(state[key]||0));save('Formation retirée du panier.');(cart.querySelector('[data-delta]')||cart.querySelector('[data-close-cart]')).focus();}
    if (e.target.closest('[data-continue-shopping]')) close();
  });
  document.addEventListener('click',e => {
    const add=e.target.closest('[data-demo-add]');
    if (add && Object.hasOwn(catalog,add.dataset.demoAdd)) {
      e.preventDefault();e.stopImmediatePropagation();state=change(state,add.dataset.demoAdd,1);save('Formation ajoutée au panier.');open();
    } else if (e.target.closest('[data-open-cart]')) {e.preventDefault();open();}
  },true);
  render();
  // Keep the original theme's reveal animations, triggered as sections enter view.
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const observer=new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {entry.target.classList.remove('scroll-trigger--offscreen');observer.unobserve(entry.target);}
    }),{rootMargin:'0px 0px -35px 0px',threshold:0.08});
    document.querySelectorAll('.scroll-trigger').forEach(el => {el.classList.add('scroll-trigger--offscreen');observer.observe(el);});
  } else document.querySelectorAll('.scroll-trigger').forEach(el => el.classList.remove('scroll-trigger--offscreen'));
})();
