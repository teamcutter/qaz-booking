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

function trackGoal(name) {
  if (typeof window.ym === 'function') {
    window.ym(113593239, 'reachGoal', name);
  }
}

document.querySelectorAll('a[href="#demo"]').forEach(link => {
  link.addEventListener('click', () => trackGoal('demo_click'));
});

const scenarioButtons = [...document.querySelectorAll('[data-scenario]')];
const scenarioPanels = [...document.querySelectorAll('[data-scenario-panel]')];
const scenarioLabel = document.querySelector('#scenario-phone-label');
const comparisonSummaryTitle = document.querySelector('#comparison-summary-title');
const comparisonSummaryText = document.querySelector('#comparison-summary-text');

scenarioButtons.forEach(button => button.addEventListener('click', () => {
  const isChat = button.dataset.scenario === 'chat';
  scenarioButtons.forEach(item => {
    const selected = item === button;
    item.classList.toggle('is-active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  scenarioPanels.forEach(panel => { panel.hidden = panel.dataset.scenarioPanel !== button.dataset.scenario; });
  scenarioLabel.textContent = isChat ? 'ПЕРЕПИСКА' : 'ОНЛАЙН-ЗАПИСЬ';
  comparisonSummaryTitle.textContent = isChat ? 'Нужно дождаться ответа' : 'Гость видит свободное время';
  comparisonSummaryText.textContent = isChat
    ? 'В примере администратор уточняет график, а клиент задаёт следующий вопрос.'
    : 'Он выбирает услугу и подходящее окно в одном интерфейсе.';
}));

const previewTimes = [...document.querySelectorAll('[data-preview-time]')];
previewTimes.forEach(button => button.addEventListener('click', () => {
  previewTimes.forEach(item => {
    const selected = item === button;
    item.classList.toggle('is-selected', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  document.querySelector('#scenario-selection').textContent = `Выбрано ${button.dataset.previewTime} · без переписки`;
}));

const calculatorRequests = document.querySelector('#calc-requests');
const calculatorMinutes = document.querySelector('#calc-minutes');
const calculatorNumberFormat = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 });

function requestWord(count) {
  if (count % 100 >= 11 && count % 100 <= 14) return 'запросов';
  if (count % 10 === 1) return 'запрос';
  if (count % 10 >= 2 && count % 10 <= 4) return 'запроса';
  return 'запросов';
}

function updateCalculator() {
  const requests = Number(calculatorRequests.value);
  const minutes = Number(calculatorMinutes.value);
  const totalMinutes = requests * minutes * 22;
  document.querySelector('#calc-requests-value').textContent = String(requests);
  document.querySelector('#calc-minutes-value').textContent = String(minutes);
  document.querySelector('#calc-hours').textContent = calculatorNumberFormat.format(totalMinutes / 60);
  document.querySelector('#calc-workdays').textContent = calculatorNumberFormat.format(totalMinutes / 480);
  document.querySelector('#calc-formula').textContent = `${requests} ${requestWord(requests)} × ${minutes} мин × 22 рабочих дня ÷ 60`;
  [calculatorRequests, calculatorMinutes].forEach(input => {
    const fill = (Number(input.value) - Number(input.min)) / (Number(input.max) - Number(input.min)) * 100;
    input.style.setProperty('--fill', `${fill}%`);
  });
}

calculatorRequests.addEventListener('input', updateCalculator);
calculatorMinutes.addEventListener('input', updateCalculator);
updateCalculator();

let demoStarted = false;
let demoCompleted = false;
function recordDemoStart() {
  if (demoStarted) return;
  demoStarted = true;
  trackGoal('demo_start');
}

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

const services = makeSingleSelect('.service-option', recordDemoStart);
const days = makeSingleSelect('.day-option', recordDemoStart);
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
  recordDemoStart();
  submit.disabled = false;
  submit.innerHTML = 'Показать итог выбора <span aria-hidden="true">↗</span>';
});

const demoPersonas = {
  salon: {
    label: 'САЛОН КРАСОТЫ',
    message: 'Пример записи для салона красоты',
    services: [
      { name: 'Маникюр', duration: '60 мин', price: '8 000 ₸', icon: '✳' },
      { name: 'Стрижка', duration: '45 мин', price: '6 000 ₸', icon: '✦' }
    ],
    times: ['10:00', '11:30', '14:00', '16:30']
  },
  barber: {
    label: 'БАРБЕРШОП',
    message: 'Пример записи в барбершоп',
    services: [
      { name: 'Мужская стрижка', duration: '45 мин', price: '7 000 ₸', icon: '✂' },
      { name: 'Оформление бороды', duration: '30 мин', price: '4 000 ₸', icon: '◆' }
    ],
    times: ['09:30', '12:00', '15:00', '18:00']
  },
  nail: {
    label: 'NAIL-СТУДИЯ',
    message: 'Пример записи в nail-студию',
    services: [
      { name: 'Маникюр', duration: '60 мин', price: '8 000 ₸', icon: '✳' },
      { name: 'Педикюр', duration: '90 мин', price: '11 000 ₸', icon: '◇' }
    ],
    times: ['10:30', '13:00', '15:30', '17:00']
  },
  solo: {
    label: 'ЧАСТНЫЙ МАСТЕР',
    message: 'Пример записи к частному мастеру',
    services: [
      { name: 'Макияж', duration: '60 мин', price: '10 000 ₸', icon: '♡' },
      { name: 'Укладка', duration: '45 мин', price: '7 000 ₸', icon: '✦' }
    ],
    times: ['09:00', '11:00', '14:30', '17:30']
  }
};

function resetDemoFlow() {
  document.querySelector('#booking-result').hidden = true;
  document.querySelector('#booking-flow').hidden = false;
  document.querySelector('#result-details').textContent = '';
  times.forEach(button => {
    button.classList.remove('selected');
    button.setAttribute('aria-pressed', 'false');
  });
  submit.disabled = true;
  submit.innerHTML = 'Выберите время <span aria-hidden="true">↗</span>';
}

const personaButtons = [...document.querySelectorAll('[data-persona]')];
personaButtons.forEach(button => button.addEventListener('click', () => {
  recordDemoStart();
  if (button.classList.contains('is-active')) return;

  const persona = demoPersonas[button.dataset.persona];
  personaButtons.forEach(item => {
    const selected = item === button;
    item.classList.toggle('is-active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  document.querySelector('#persona-message').textContent = persona.message;
  document.querySelector('#booking-context').textContent = `${persona.label} • ПРИМЕР`;

  services.forEach((serviceButton, index) => {
    const service = persona.services[index];
    serviceButton.dataset.service = service.name;
    serviceButton.dataset.duration = service.duration;
    serviceButton.dataset.price = service.price;
    serviceButton.querySelector('.service-symbol').textContent = service.icon;
    serviceButton.querySelector('strong').textContent = service.name;
    serviceButton.querySelector('small').textContent = `${service.duration} · ${service.price}`;
    serviceButton.classList.toggle('selected', index === 0);
    serviceButton.setAttribute('aria-pressed', String(index === 0));
  });
  days.forEach((dayButton, index) => {
    dayButton.classList.toggle('selected', index === 0);
    dayButton.setAttribute('aria-pressed', String(index === 0));
  });
  times.forEach((timeButton, index) => {
    timeButton.dataset.time = persona.times[index];
    timeButton.textContent = persona.times[index];
  });
  resetDemoFlow();
}));

submit.addEventListener('click', () => {
  const service = services.find(button => button.classList.contains('selected'));
  const day = days.find(button => button.classList.contains('selected'));
  const time = times.find(button => button.classList.contains('selected'));
  if (!time) return;
  document.querySelector('#result-details').textContent = `${service.dataset.service} · ${service.dataset.duration} · ${service.dataset.price} · ${day.dataset.day}, ${time.dataset.time}`;
  document.querySelector('#booking-flow').hidden = true;
  document.querySelector('#booking-result').hidden = false;
  if (!demoCompleted) {
    demoCompleted = true;
    trackGoal('demo_complete');
  }
  document.querySelector('#start-over').focus();
});

document.querySelector('#start-over').addEventListener('click', () => {
  resetDemoFlow();
  times[0].focus();
});
