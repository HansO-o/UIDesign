const root = document.querySelector('.segmented');
if (root) {
  const indicator = root.querySelector('.segment-indicator');
  const options = [...root.querySelectorAll('[role="radio"]')];
  let selected = options.findIndex(option => option.getAttribute('aria-checked') === 'true');
  let pointer = null;
  let dragging = false;
  let offset = 0;
  const width = () => (root.clientWidth - 8) / options.length;
  const clamp = x => Math.max(0, Math.min((options.length - 1) * width(), x));
  const draw = x => { indicator.style.transform = `translateX(${clamp(x)}px)`; };
  function select(index, focus = false) {
    selected = (index + options.length) % options.length;
    options.forEach((option, i) => { option.setAttribute('aria-checked', String(i === selected)); option.tabIndex = i === selected ? 0 : -1; });
    draw(selected * width());
    if (focus) options[selected].focus();
  }
  options.forEach((option, i) => {
    option.addEventListener('click', () => { if (!dragging) select(i); });
    option.addEventListener('keydown', e => {
      let index = selected;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') index++;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') index--;
      else if (e.key === 'Home') index = 0;
      else if (e.key === 'End') index = options.length - 1;
      else return;
      e.preventDefault(); select(index, true);
    });
  });
  root.addEventListener('pointerdown', e => {
    if (e.button !== 0 || !options[selected].contains(e.target)) return;
    pointer = { id: e.pointerId, x: e.clientX, initial: selected * width() };
    offset = pointer.initial;
  });
  root.addEventListener('pointermove', e => {
    if (!pointer || pointer.id !== e.pointerId) return;
    const delta = e.clientX - pointer.x;
    if (!dragging && Math.abs(delta) > 4) { dragging = true; root.classList.add('dragging'); root.setPointerCapture(e.pointerId); }
    if (dragging) { e.preventDefault(); offset = clamp(pointer.initial + delta); draw(offset); }
  });
  const finish = e => {
    if (!pointer || pointer.id !== e.pointerId) return;
    const wasDragging = dragging;
    pointer = null;
    root.classList.remove('dragging');
    if (wasDragging) select(Math.round(offset / width()), true);
    // Keep the drag flag through the synthesized click so it cannot undo the result.
    if (wasDragging) setTimeout(() => { dragging = false; }, 0);
  };
  root.addEventListener('pointerup', finish);
  root.addEventListener('pointercancel', e => { if (!pointer || pointer.id !== e.pointerId) return; pointer = null; dragging = false; root.classList.remove('dragging'); select(selected); });
  window.addEventListener('resize', () => draw(selected * width()));
  select(Math.max(0, selected));
}
