// Interactive examples. All state lives in the page and resets on reload.
document.querySelectorAll('.ud-segment').forEach(root => {
  const indicator = root.querySelector('.ud-segment-indicator');
  const options = [...root.querySelectorAll('[role="radio"]')];
  if (!indicator || !options.length) return;
  let selected = Math.max(0, options.findIndex(option => option.getAttribute('aria-checked') === 'true'));
  let pointer = null;
  let suppressClick = false;
  const width = () => (root.clientWidth - 6) / options.length;
  const clamp = x => Math.max(0, Math.min((options.length - 1) * width(), x));
  const draw = x => { indicator.style.transform = `translateX(${clamp(x)}px)`; };
  function select(index, focus = false) {
    selected = (index + options.length) % options.length;
    options.forEach((option, i) => { option.setAttribute('aria-checked', String(i === selected)); option.tabIndex = i === selected ? 0 : -1; });
    draw(selected * width());
    if (focus) options[selected].focus();
  }
  options.forEach((option, i) => {
    option.addEventListener('click', e => { if (suppressClick) { e.preventDefault(); return; } select(i); });
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
    pointer = { id: e.pointerId, x: e.clientX, initial: selected * width(), position: selected * width(), dragging: false };
  });
  root.addEventListener('pointermove', e => {
    if (!pointer || pointer.id !== e.pointerId) return;
    const delta = e.clientX - pointer.x;
    if (!pointer.dragging && Math.abs(delta) > 4) { pointer.dragging = true; root.classList.add('ud-dragging'); root.setPointerCapture(e.pointerId); }
    if (pointer.dragging) { e.preventDefault(); pointer.position = clamp(pointer.initial + delta); draw(pointer.position); }
  });
  root.addEventListener('pointerup', e => {
    if (!pointer || pointer.id !== e.pointerId) return;
    const current = pointer; pointer = null; root.classList.remove('ud-dragging');
    if (current.dragging) { suppressClick = true; select(Math.round(current.position / width()), true); setTimeout(() => { suppressClick = false; }, 0); }
  });
  root.addEventListener('pointercancel', e => { if (!pointer || pointer.id !== e.pointerId) return; pointer = null; root.classList.remove('ud-dragging'); select(selected); });
  root.addEventListener('lostpointercapture', e => { if (!pointer || pointer.id !== e.pointerId) return; pointer = null; root.classList.remove('ud-dragging'); select(selected); });
  window.addEventListener('resize', () => draw(selected * width()));
  select(selected);
});

document.querySelectorAll('.ud-tabs').forEach(tabs => {
  const items = [...tabs.querySelectorAll('[role="tab"]')];
  function activate(index, focus = false) {
    index = (index + items.length) % items.length;
    items.forEach((item, i) => {
      item.setAttribute('aria-selected', String(i === index)); item.tabIndex = i === index ? 0 : -1;
      const panel = document.getElementById(item.getAttribute('aria-controls')); if (panel) panel.hidden = i !== index;
    });
    if (focus) items[index].focus();
  }
  items.forEach((item, i) => {
    item.addEventListener('click', () => activate(i));
    item.addEventListener('keydown', e => {
      let next = i;
      if (e.key === 'ArrowRight') next++;
      else if (e.key === 'ArrowLeft') next--;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = items.length - 1;
      else return;
      e.preventDefault(); activate(next, true);
    });
  });
});
const range = document.getElementById('ud-brightness');
const rangeOutput = document.getElementById('ud-brightness-value');
if (range && rangeOutput) range.addEventListener('input', () => { rangeOutput.textContent = `${range.value}%`; });
document.querySelectorAll('.ud-stepper').forEach(stepper => {
  const output = stepper.querySelector('output');
  const buttons = [...stepper.querySelectorAll('[data-ud-step]')];
  let value = 1;
  function update() { output.textContent = value; buttons.forEach(button => { button.disabled = (value <= 1 && Number(button.dataset.udStep) < 0) || (value >= 10 && Number(button.dataset.udStep) > 0); }); }
  buttons.forEach(button => button.addEventListener('click', () => { value = Math.max(1, Math.min(10, value + Number(button.dataset.udStep))); update(); }));
  update();
});
