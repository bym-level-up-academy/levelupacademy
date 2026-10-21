(() => {
  let config = {};
  const ready = fetch('/metaforma.json').then(r => r.json()).then(data => config = data).catch(() => {});
  const dialog = document.createElement('dialog');
  dialog.className = 'migration-dialog';
  dialog.setAttribute('aria-labelledby', 'migration-dialog-title');
  dialog.innerHTML = '<h2 id="migration-dialog-title"></h2><p></p><a class="button" href="https://calendly.com/contact-level-up-academy/30min" target="_blank" rel="noopener">Réserver un appel découverte</a><p><button type="button" class="button button--secondary">Fermer</button></p>';
  document.body.append(dialog);
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
  function notice(title, message) {
    dialog.querySelector('h2').textContent = title;
    dialog.querySelector('p').textContent = message;
    if (!dialog.open) dialog.showModal();
  }
  async function go(key) {
    await ready;
    const url = config[key];
    if (url && /^https:\/\//.test(url)) { location.assign(url); return; }
    notice('Accès à la formation', 'Le lien vers l’espace Metaforma sera disponible dès que la migration sera terminée. Vous pouvez contacter Level Up Academy pour en savoir plus.');
  }
  document.addEventListener('click', e => {
    const cta = e.target.closest('[data-metaforma]');
    if (cta) { e.preventDefault(); go(cta.dataset.metaforma); return; }
    const advice = e.target.closest('a,button');
    if (advice && advice.textContent.includes('Conseils gratuits par mail')) {
      e.preventDefault(); document.querySelector('.contact-form')?.scrollIntoView({behavior:'smooth'});
    }
  });
  document.querySelectorAll('form[data-local-form]').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault(); await ready;
      if (config.contact && /^https:\/\//.test(config.contact)) { location.assign(config.contact); return; }
      notice('Demande de renseignements', 'Le formulaire est en cours de raccordement. Aucune donnée n’a été envoyée ni enregistrée. Pour contacter l’équipe, réservez un appel découverte.');
    });
  });
  document.querySelectorAll('[id="mailAdvicePopup"], [id="successPopup"]').forEach(x => x.remove());
})();
