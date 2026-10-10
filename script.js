const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Открыть меню');
  mobileNav.hidden = true;
}

menuToggle.addEventListener('click', () => {
  const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(willOpen));
  menuToggle.setAttribute('aria-label', willOpen ? 'Закрыть меню' : 'Открыть меню');
  mobileNav.hidden = !willOpen;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

document.querySelectorAll('a[href="#demo"]').forEach(link => {
  link.addEventListener('click', () => {
    if (typeof window.ym === 'function') {
      window.ym(113593239, 'reachGoal', 'demo_click');
    }
  });
});

function makeSingleSelect(selector, onSelect) {
  const buttons = [...document.querySelectorAll(selector)];
  buttons.forEach(button => button.addEventListener('click', () => {
    buttons.forEach(item => {
      const selected = item === button;
      item.classList.toggle('selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    onSelect?.(button);
  }));
  return buttons;
}

const services = makeSingleSelect('.service-option');
const days = makeSingleSelect('.day-option');
const firstDemoDay = new Date();
firstDemoDay.setHours(12, 0, 0, 0);
firstDemoDay.setDate(firstDemoDay.getDate() + 1);
days.forEach((button, index) => {
  const date = new Date(firstDemoDay);
  date.setDate(firstDemoDay.getDate() + index);
  const weekday = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' }).format(date).replace('.', '').toUpperCase();
  const displayDate = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(date);
  button.querySelector('small').textContent = weekday;
  button.querySelector('strong').textContent = String(date.getDate());
  button.dataset.day = displayDate;
  button.setAttribute('aria-label', displayDate);
});
const submit = document.querySelector('#booking-submit');
const times = makeSingleSelect('.time-options button', () => {
  submit.disabled = false;
  submit.innerHTML = 'Показать результат <span aria-hidden="true">↗</span>';
});

submit.addEventListener('click', () => {
  const service = services.find(button => button.classList.contains('selected'));
  const day = days.find(button => button.classList.contains('selected'));
  const time = times.find(button => button.classList.contains('selected'));
  if (!time) return;
  document.querySelector('#result-details').textContent = `${service.dataset.service} · ${service.dataset.duration} · ${service.dataset.price} · ${day.dataset.day}, ${time.dataset.time}`;
  document.querySelector('#booking-flow').hidden = true;
  document.querySelector('#booking-result').hidden = false;
  document.querySelector('#start-over').focus();
});

document.querySelector('#start-over').addEventListener('click', () => {
  document.querySelector('#booking-result').hidden = true;
  document.querySelector('#booking-flow').hidden = false;
  times.forEach(button => { button.classList.remove('selected'); button.setAttribute('aria-pressed', 'false'); });
  submit.disabled = true;
  submit.innerHTML = 'Выберите время <span aria-hidden="true">↗</span>';
  times[0].focus();
});
